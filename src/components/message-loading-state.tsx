import type { LucideIcon } from 'lucide-react';
import { TextShimmer } from './core/text-shimmer';
import { BorderTrail } from './core/border-trail';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';

export const MessageLoadingState = ({
  icon: Icon,
  text,
  color,
}: {
  icon: LucideIcon;
  text: string;
  color: 'red' | 'green' | 'orange' | 'violet' | 'gray' | 'blue';
}) => {
  const colorVariants = {
    red: {
      background: 'bg-red-50 dark:bg-red-950',
      border:
        'from-red-200 via-red-500 to-red-200 dark:from-red-400 dark:via-red-500 dark:to-red-700',
      text: 'text-red-500',
      icon: 'text-red-500',
    },
    green: {
      background: 'bg-green-50 dark:bg-green-950',
      border:
        'from-green-200 via-green-500 to-green-200 dark:from-green-400 dark:via-green-500 dark:to-green-700',
      text: 'text-green-500',
      icon: 'text-green-500',
    },
    orange: {
      background: 'bg-orange-50 dark:bg-orange-950',
      border:
        'from-orange-200 via-orange-500 to-orange-200 dark:from-orange-400 dark:via-orange-500 dark:to-orange-700',
      text: 'text-orange-500',
      icon: 'text-orange-500',
    },
    violet: {
      background: 'bg-violet-50 dark:bg-violet-950',
      border:
        'from-violet-200 via-violet-500 to-violet-200 dark:from-violet-400 dark:via-violet-500 dark:to-violet-700',
      text: 'text-violet-500',
      icon: 'text-violet-500',
    },
    gray: {
      background: 'bg-neutral-50 dark:bg-neutral-950',
      border:
        'from-neutral-200 via-neutral-500 to-neutral-200 dark:from-neutral-400 dark:via-neutral-500 dark:to-neutral-700',
      text: 'text-neutral-500',
      icon: 'text-neutral-500',
    },
    blue: {
      background: 'bg-blue-50 dark:bg-blue-950',
      border:
        'from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700',
      text: 'text-blue-500',
      icon: 'text-blue-500',
    },
  };

  const variant = colorVariants[color];

  return (
    <Card className="relative w-full h-[100px] my-4 overflow-hidden shadow-none">
      <BorderTrail
        className={cn('bg-gradient-to-l', variant.border)}
        size={80}
      />
      <CardContent className="p-6">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'relative h-10 w-10 rounded-full flex items-center justify-center',
                variant.background,
              )}
            >
              <BorderTrail
                className={cn('bg-gradient-to-l', variant.border)}
                size={40}
              />
              <Icon className={cn('h-5 w-5', variant.icon)} />
            </div>
            <div className="space-y-2">
              <TextShimmer className="text-base font-medium" duration={2}>
                {text}
              </TextShimmer>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`ele-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      i
                    }`}
                    className="h-1.5 rounded-full bg-neutral-700 animate-pulse"
                    style={{
                      width: `${Math.random() * 40 + 20}px`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
