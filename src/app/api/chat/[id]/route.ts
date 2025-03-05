import { getChatById } from '@/db/queries';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    if (!id) {
      return new NextResponse('Chat ID is required', { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
      return new NextResponse('Chat not found', { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('[CHAT_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
