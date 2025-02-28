export const IS_PROD = process.env.NODE_ENV === 'production';
export const BASE_URL = !IS_PROD
  ? 'http://localhost:3000'
  : 'https://getmentor.vercel.app';
export const MENTOR_AI_EMAIL =
  process.env.MENTOR_AI_EMAIL || 'delivered@resend.dev';
