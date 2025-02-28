export const IS_PROD = process.env.NODE_ENV === 'production';
export const BASE_URL = !IS_PROD
  ? 'http://localhost:3000'
  : 'https://getmentor.vercel.app';
