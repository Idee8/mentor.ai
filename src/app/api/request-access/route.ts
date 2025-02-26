import { RequestAccessEmailTemplate } from "@/components/emails/request-access";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (email) {
    return Response.json({ error: "Please provide your email" });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "MentorAI <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Mentor AI – You're on the Waitlist!",
      react: RequestAccessEmailTemplate({}) as any,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
