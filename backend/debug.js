const { SignJWT } = require('jose');
const crypto = require('crypto');

async function debug() {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecret');
  const token = await new SignJWT({ userId: '555634a5-05c5-4e16-99b9-207e50fb07db' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(secret);

  console.log('Fetching /api/friends...');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

debug().catch(console.error);
