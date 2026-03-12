export interface User {
  id: string;
  name: string;
  email: string;
  avatar_color: string;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_email: string;
  requester_avatar_color: string;
  created_at: string;
}

export interface Friend {
  id: string;
  friend_id: string;
  friend_name: string;
  friend_email: string;
  friend_avatar_color: string;
  created_at: string;
}

export interface PendingRequest {
  receiver_id: string;
  receiver_name: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: string;
  is_read: boolean;
  sender_name: string;
  sender_avatar_color: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login:    (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout:   () => void;
  loading:  boolean;
}

export interface ChatContextType {
  friends:         Friend[];
  friendRequests:  FriendRequest[];
  pendingRequests: PendingRequest[];
  allUsers:        User[];
  messages:        Message[];
  activeFriend:    Friend | null;
  setActiveFriend: (f: Friend | null) => void;
  sendMessage:     (content: string) => Promise<void>;
  sendRequest:     (receiverId: string) => Promise<void>;
  respondRequest:  (requesterId: string, accept: boolean) => Promise<void>;
  loadMessages:    (friendId: string) => Promise<void>;
  refreshAll:      () => Promise<void>;
  chatLoading:     boolean;
  msgLoading:      boolean;
  error:           string;
  clearError:      () => void;
}
