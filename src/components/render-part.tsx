import type {
  ReasoningUIPart,
  SourceUIPart,
  TextUIPart,
  ToolInvocationUIPart,
} from '@ai-sdk/ui-utils';
import { Check, Copy, Hexagon, RefreshCcw } from 'lucide-react';

import { MarkdownRenderer } from './markdown-renderer';
import { ToolInvocationListView } from './tool-invocation-list-view';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export type MessagePart =
  | TextUIPart
  | ReasoningUIPart
  | ToolInvocationUIPart
  | SourceUIPart;

export const renderPart = ({
  message,
  messageIndex,
  part,
  partIndex,
  parts,
  status,
  handleRegenerate,
}: {
  part: MessagePart;
  messageIndex: number;
  partIndex: number;
  parts: MessagePart[];
  message: any;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  handleRegenerate: () => void;
}) => {
  const CopyButton = ({ text }: { text: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          if (!navigator.clipboard) {
            return;
          }
          await navigator.clipboard.writeText(text);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          toast.success('Copied to clipboard');
        }}
        className="h-8 px-2 text-xs rounded-full"
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    );
  };

  if (
    part.type === 'text' &&
    partIndex === 0 &&
    parts.some((p, i) => i > partIndex && p.type === 'tool-invocation')
  ) {
    return null;
  }

  switch (part.type) {
    case 'text':
      if (
        part.text.trim() === '' ||
        part.text === null ||
        part.text === undefined ||
        !part.text
      ) {
        return null;
      }
      return (
        <div key={`${messageIndex}-${partIndex}-text`}>
          <div className="flex items-center justify-between mt-5 mb-2">
            <div className="flex items-center gap-2">
              <Hexagon className="size-5 text-primary" />
              <h2 className="text-base font-semibold text-neutral-200">
                Answer
              </h2>
            </div>
            {status === 'ready' && (
              <div>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  onClick={() => handleRegenerate()}
                  className="h-8 px-2 text-xs rounded-full"
                >
                  <RefreshCcw />
                </Button>
                <CopyButton text={part.text} />
              </div>
            )}
          </div>
          <MarkdownRenderer content={part.text} />
        </div>
      );
    case 'tool-invocation':
      return (
        <ToolInvocationListView
          toolInvocations={[part.toolInvocation]}
          message={message}
          key={`${messageIndex}-${partIndex}-tool`}
        />
      );
    case 'reasoning':
      return (
        <div>
          <p>Reasoning</p>
        </div>
      );
    default:
      return null;
  }
};
