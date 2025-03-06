import { put } from '@vercel/blob';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { embedMany } from 'ai';

import { auth } from '@/lib/auth';
import { getFileContentFromUrl } from '@/lib/utils';
import { insertChunks } from '@/db/queries';
import { myProvider } from '@/ai/models';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    return Response.redirect('/login');
  }

  const { user } = session;

  if (!user) {
    return Response.redirect('/login');
  }

  if (req.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  const { downloadUrl } = await put(`${user.email}/${filename}`, req.body, {
    access: 'public',
  });

  const content = await getFileContentFromUrl(downloadUrl);
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
  });
  const chunkedContent = await textSplitter.createDocuments([content]);

  const { embeddings } = await embedMany({
    model: myProvider.textEmbeddingModel('google'),
    values: chunkedContent.map((chunk) => chunk.pageContent),
  });

  await insertChunks({
    chunks: chunkedContent.map((chunk, i) => ({
      id: `${user.email}/${filename}/${i}`,
      filePath: `${user.email}/${filename}`,
      content: chunk.pageContent,
      embeddings: embeddings[i],
    })),
  });

  return Response.json({});
}
