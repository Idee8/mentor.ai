import { toast } from 'sonner';
import { memo } from 'react';
import { useSWRConfig } from 'swr';
import type { Message } from 'ai';
import { useCopyToClipboard } from 'usehooks-ts';
import { CopyIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import equal from 'fast-deep-equal';

import type { Vote } from '@/db/schema';
import { Button } from './ui/button';

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === 'user') return null;

  return (
    <>
      <Button
        className="py-1 px-2 h-fit text-muted-foreground"
        variant={'ghost'}
        onClick={async () => {
          await copyToClipboard(message.content as string);
          toast.success('Copied to clipboard');
        }}
      >
        <CopyIcon />
      </Button>

      <Button
        className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
        disabled={vote?.isUpvoted}
        variant="ghost"
        onClick={async () => {
          const upvote = fetch('/api/vote', {
            method: 'PATCH',
            body: JSON.stringify({
              chatId,
              messageId: message.id,
              type: 'up',
            }),
          });

          toast.promise(upvote, {
            loading: 'Upvoting...',
            success: () => {
              mutate<Array<Vote>>(
                `/api/vote?chatId=${chatId}`,
                (currentVotes) => {
                  if (!currentVotes) return [];

                  const votesWithoutCurrent = currentVotes.filter(
                    (vote) => vote.messageId !== message.id,
                  );

                  return [
                    ...votesWithoutCurrent,
                    {
                      chatId,
                      messageId: message.id,
                      isUpvoted: true,
                    },
                  ];
                },
                { revalidate: false },
              );

              return 'Upvoted!';
            },
            error: 'Failed to upvote.',
          });
        }}
      >
        <ThumbsUpIcon />
      </Button>

      <Button
        className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
        variant="ghost"
        disabled={vote && !vote.isUpvoted}
        onClick={async () => {
          const downvote = fetch('/api/vote', {
            method: 'PATCH',
            body: JSON.stringify({
              chatId,
              messageId: message.id,
              type: 'down',
            }),
          });

          toast.promise(downvote, {
            loading: 'Downvoting...',
            success: () => {
              mutate<Array<Vote>>(
                `/api/vote?chatId=${chatId}`,
                (currentVotes) => {
                  if (!currentVotes) return [];

                  const votesWithoutCurrent = currentVotes.filter(
                    (vote) => vote.messageId !== message.id,
                  );

                  return [
                    ...votesWithoutCurrent,
                    {
                      chatId,
                      messageId: message.id,
                      isUpvoted: false,
                    },
                  ];
                },
                { revalidate: false },
              );

              return 'Downvoted!';
            },
            error: 'Failed to downvote.',
          });
        }}
      >
        <ThumbsDownIcon />
      </Button>
    </>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);
