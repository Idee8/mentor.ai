'use client';

import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { authClient } from '@/lib/auth-client';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const res = await authClient.resetPassword({
      newPassword: password,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      token: new URLSearchParams(window.location.search).get('token')!,
    });
    if (res.error) {
      toast.error(res.error.message);
    }
    setIsSubmitting(false);
    router.push('/sign-in');
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="max-w-[350px] space-y-4">
        <div className="flex flex-col gap-4">
          <p className="text-lg">Reset password</p>
          <p className="text-neutral-300">
            Enter new password and confirm it to reset your password
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-2">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="email" className="text-sm">
                  New password
                </label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="password"
                  placeholder="Password"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="email" className="text-sm">
                  Confirm password
                </label>
                <PasswordInput
                  id="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="password"
                  placeholder="Password"
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
              {isSubmitting ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
