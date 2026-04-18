'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../UI/Avatar';

interface EditProfileModalProps {
  onClose: () => void;
}

export default function EditProfileModal({ onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(user?.avatar_url || null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImage = async (fileToUpload: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', fileToUpload);
    
    // Using environment variables for Cloudinary
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!preset || !cloudName) {
      throw new Error('Cloudinary configuration is missing in .env.local');
    }

    formData.append('upload_preset', preset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload image. Please try again.');
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);
      let newAvatarUrl = user?.avatar_url;

      if (file) {
        newAvatarUrl = await uploadImage(file);
      }

      await updateProfile(name, newAvatarUrl);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-surface-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
              {error}
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-brand shadow-lg"
                />
              ) : (
                <Avatar name={name || user.name} color={user.avatar_color} url={user.avatar_url} size="xl" className="w-24 h-24 text-4xl" />
              )}
              
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="text-white" size={24} />
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <div className="flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-brand hover:underline"
              >
                Change Picture
              </button>
              {file && (
                <>
                  <span className="text-white/20">|</span>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name Section */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand transition-colors"
              placeholder="Your Name"
              required
              maxLength={60}
            />
          </div>

          {/* Footer / Submit */}
          <button
            type="submit"
            disabled={loading || !name.trim() || success}
            className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold py-2.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : success ? (
              <>
                <CheckCircle2 size={20} /> Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
