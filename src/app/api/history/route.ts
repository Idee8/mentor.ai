import { getChatsByUserId } from '@/db/queries';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const chats = await getChatsByUserId({ id: session.user.id! });
  return Response.json(chats);
}
