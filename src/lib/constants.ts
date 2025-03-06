export const IS_PROD = process.env.NODE_ENV === 'production';
export const BASE_URL = !IS_PROD
  ? 'http://localhost:3000'
  : 'https://getmentor.vercel.app';
export const MENTOR_AI_EMAIL =
  process.env.MENTOR_AI_EMAIL || 'delivered@resend.dev';

export const programmingFileExtensions = [
  // JavaScript/TypeScript
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  // Web
  '.html',
  '.css',
  '.scss',
  // Backend languages
  '.py',
  '.java',
  '.c',
  '.cpp',
  '.cs',
  '.go',
  '.rb',
  '.php',
  '.swift',
  '.kt',
  '.rs',
  // Config/markup
  '.json',
  '.xml',
  '.yaml',
  '.yml',
  // Shell/scripting
  '.sh',
  '.pl',
  '.lua',
];
