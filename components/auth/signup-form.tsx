'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from '../ui/spinner';
import { Bot } from 'lucide-react';
import { db } from '@/services/server-client/db';

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (data) {
        db.saveProfile({ email: email });
      }
      if (error) throw error;
      router.push('/auth/sign-up-success');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6' {...props}>
      <div
        className='flex justify-center items-center gap-2.5 cursor-pointer'
        onClick={() => router.push('/')}>
        <div className='h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20'>
          <Bot className='text-white h-5 w-5' />
        </div>
        <span className='font-bold text-xl text-slate-900 tracking-tight'>
          Ollie
        </span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <FieldGroup className='gap-2'>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='confirm-password'>
                  Confirm Password
                </FieldLabel>
                <Input
                  id='confirm-password'
                  type='password'
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </Field>
              <FieldGroup>
                <Field>
                  {error && <p className='text-sm text-red-500'>{error}</p>}
                  <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? <Spinner /> : 'Create Account'}
                  </Button>
                  <Button variant='ghost' type='button'>
                    Sign up with Google
                  </Button>
                  <FieldDescription className='px-6 text-center'>
                    Already have an account?{' '}
                    <Link
                      href='/auth/login'
                      className='underline underline-offset-4'>
                      Sign In
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
