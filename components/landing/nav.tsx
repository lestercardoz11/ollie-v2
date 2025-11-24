import { Bot, LayoutDashboard } from 'lucide-react';
import { Button } from '../custom/button';
import { useRouter } from 'next/navigation';
import { JwtPayload } from '@supabase/supabase-js';

interface LandingProps {
  user: JwtPayload | null;
}

export default function Nav({ user }: LandingProps) {
  const router = useRouter();
  return (
    <header className='w-full transition-all duration-300'>
      <div className='container mx-auto px-6 h-16 flex justify-between items-center max-w-7xl'>
        <div className='flex items-center gap-2.5'>
          <div className='h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20'>
            <Bot className='text-white h-5 w-5' />
          </div>
          <span className='font-bold text-xl text-slate-900 tracking-tight'>
            Ollie
          </span>
        </div>

        <div className='flex gap-3'>
          {user ? (
            <Button
              size='sm'
              onClick={() => router.push('/dashboard')}
              className='shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all gap-2 cursor-pointer'>
              <LayoutDashboard size={14} />
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => router.push('/auth/login')}
                className='hidden sm:flex'>
                Log In
              </Button>
              <Button
                size='sm'
                onClick={() => router.push('/auth/sign-up')}
                className='shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all'>
                Get Started Free
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
