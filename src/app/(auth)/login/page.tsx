'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpRight, Hexagon } from 'lucide-react';
import { Github, GitLab } from '@/components/icons';
import { PasswordInput } from '@/components/ui/password-input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const result = await signIn.email({
        email,
        password,
        callbackURL: '/dash',
      });

      if (result?.error) {
        setError(result.error.message);
      }
      // Redirect will be handled by next-auth if successful
    } catch (err) {
      setError('An error occurred during sign in');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Link
        href={'/'}
        className="group absolute top-0 left-0 m-3 flex divide-neutral-500 rounded-full border border-neutral-500 bg-neutral-800 text-xs font-medium drop-shadow-sm transition-colors duration-75 hover:bg-neutral-700 sm:divide-x animate-slide-up-fade [--offset:10px] [animation-delay:0ms] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in"
      >
        <span className="py-1.5 pl-4 text-foreground sm:pr-2.5">Go home</span>
        <span className="flex items-center gap-1.5 p-1.5 pl-2.5">
          <div className="rounded-full bg-neutral-100 p-0.5">
            <ArrowUpRight className="size-2.5 text-neutral-700 transition-transform duration-100 group-hover:-translate-y-px group-hover:translate-x-px" />
          </div>
        </span>
      </Link>
      <div className="w-full max-w-md pt-8">
        <div>
          <Hexagon className="h-8 w-8" />
          <h2 className="mt-6 text-xl font-bold text-foreground">
            Log in to Mentor
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign up
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alan.turing@example.com"
                className="h-10 my-3"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary-foreground hover:text-primary-foreground/90"
                >
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 my-3"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <Button
            variant={'secondary'}
            size={'lg'}
            className="w-full"
            disabled={isLoading}
          >
            Continue <ArrowRightIcon />
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-primary-foreground bg-background">
                OR
              </span>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 grid-cols-1 gap-3">
            <Button
              type="button"
              variant={'outline'}
              onClick={async () =>
                await signIn.social({
                  provider: 'github',
                  callbackURL: '/dashboard',
                })
              }
            >
              <Github />
              Login with GitHub
            </Button>

            <Button
              type="button"
              variant={'outline'}
              onClick={async () => {
                await signIn.social({
                  provider: 'gitlab',
                  callbackURL: '/dash',
                });
              }}
            >
              <GitLab />
              Login with GitLab
            </Button>
          </div>
        </div>

        <p className="mt-4 text-xs text-center text-neutral-500">
          By signing in, you agree to our{' '}
          <Link
            href="/docs/tos"
            className="text-primary hover:text-primary/90 underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/docs/privacy"
            className="text-primary hover:text-primary/90 underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
