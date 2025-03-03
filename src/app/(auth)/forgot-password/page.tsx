'use client';

import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

export default function Component() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await authClient.forgetPassword({
        email,
        redirectTo: '/reset-password',
      });
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="w-[350px]">
          <div>
            <p>Check your email</p>
            <p>We've sent a password reset link to your email.</p>
          </div>
          <div>
            <div>
              <CheckCircle2 className="h-4 w-4" />
              <p>If you don't see the email, check your spam folder.</p>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to reset password
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-neutral-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="max-w-[350px] space-y-4">
        <div className="flex flex-col gap-4">
          <p className="text-lg">Forgot password</p>
          <p>Enter your email to reset your password</p>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <div className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
            <Button
              className="w-full mt-4"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        </div>
        <div className="flex justify-center">
          <Link href="/login">
            <Button variant="link" className="px-0">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
