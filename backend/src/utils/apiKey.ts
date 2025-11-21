import crypto from 'crypto';

// 1. Generate a random key (e.g., "sk_live_a1b2c3...")
export const generateApiKey = () => {
  const prefix = 'sk_live_';
  const randomString = crypto.randomBytes(24).toString('hex');
  return `${prefix}${randomString}`;
};

// 2. Hash the key for storage (SHA-256)
export const hashApiKey = (apiKey: string) => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};