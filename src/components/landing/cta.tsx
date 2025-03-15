'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { SvgGrid } from './grid';

export function CTA({
  description,
  primaryActionText,
  secondaryActionText,
  title,
}: {
  title: string;
  description: string;
  primaryActionText: string;
  secondaryActionText: string;
}) {
  const router = useRouter();
  return (
    <div className="relative mx-auto mt-8 w-full max-w-screen-lg bg-neutral-800/50 to-neutral-900/30 overflow-hidden px-10 sm:px-20 lg:px-8 py-12 my-10 sm:rounded-xl">
      <SvgGrid />
      <div className="h-72 flex flex-col gap-10 justify-center items-center">
        <h2 className="sm:text-4xl text-3xl text-center font-medium">
          {title}
        </h2>
        <p className="text-center">{description}</p>
        <div className="space-x-3">
          <Button size={'lg'} onClick={() => router.push('/login')}>
            {primaryActionText}
          </Button>
          <Button
            size={'lg'}
            variant={'ghost'}
            onClick={() => router.push('/register')}
          >
            {secondaryActionText}
          </Button>
        </div>
      </div>
    </div>
  );
}
