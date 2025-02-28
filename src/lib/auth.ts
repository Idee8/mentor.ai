import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import * as schema from '@/db/schema';
import { db } from '@/db';
import { resend } from './resend';
import { MagicLinkEmail } from '@/components/emails/verify';

export const auth = betterAuth({
  appName: 'Mentor AI',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
      user: schema.users,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github', 'gitlab'],
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // email sending function
      const { error } = await resend.emails.send({
        from: 'MentorAI <send@idee8.agency>',
        to: [user.email],
        subject: 'Verify your Email Address',
        react: MagicLinkEmail({ magicLink: url }),
      });

      if (error) {
        // TODO: logging to Sentry
        console.log(error);
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  advanced: {
    cookiePrefix: 'mentor',
  },
});
