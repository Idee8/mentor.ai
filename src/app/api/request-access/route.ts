import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

import { WelcomeEmail } from '@/components/emails/welcome';
import { db } from '@/db';
import { waitlistusers } from '@/db/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  console.log(email);

  if (!email) {
    return Response.json(
      { error: 'Please provide your email' },
      { status: 402 },
    );
  }

  try {
    const user = await db.query.waitlistusers.findFirst({
      where: eq(waitlistusers.email, email),
    });

    if (!user) {
      await db.insert(waitlistusers).values({ email });

      const { data, error } = await resend.emails.send({
        from: 'MentorAI <send@idee8.agency>',
        to: ['delivered@resend.dev'],
        subject: "Welcome to Mentor AI – You're on the Waitlist!",
        react: WelcomeEmail(),
      });

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
    }

    return Response.json({ ok: true, message: 'Already on the waitlist...' });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
