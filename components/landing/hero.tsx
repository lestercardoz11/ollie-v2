import { Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { JwtPayload } from '@supabase/supabase-js';
import { Button } from '../ui/button';

interface LandingProps {
  user: JwtPayload | null;
}

export default function Hero({ user }: LandingProps) {
  const router = useRouter();
  return (
    <section className='py-16 lg:py-24 px-6 relative overflow-hidden'>
      {/* Background Gradients */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none'>
        <div className='absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] mix-blend-multiply animate-pulse'></div>
        <div className='absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-[100px] mix-blend-multiply'></div>
      </div>

      <div className='container mx-auto max-w-5xl text-center relative z-10'>
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <Sparkles size={12} className='text-blue-500' />
          <span>New: GPT-5 Powered Interview Coach</span>
        </div>

        <h1 className='text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100'>
          Your specialized <br />
          <span className='bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
            AI Career Architect.
          </span>
        </h1>

        <p className='text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
          Stop sending generic applications. Ollie analyzes your profile and the
          job description to generate perfectly tailored CVs, cover letters, and
          interview answers in seconds.
        </p>

        <div className='flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300'>
          {user ? (
            <Button
              size='lg'
              className='h-12 px-8 text-sm shadow-xl shadow-blue-600/20 cursor-pointer'
              onClick={() => router.push('/dashboard')}>
              Go to Dashboard <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          ) : (
            <Button
              size='lg'
              className='h-12 px-8 text-sm shadow-xl shadow-blue-600/20 cursor-pointer'
              onClick={() => router.push('/auth/sign-up')}>
              Build My Profile <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          )}

          <a href='#how-it-works'>
            <Button
              size='lg'
              variant='outline'
              className='h-12 px-8 text-sm bg-white hover:bg-slate-50 border-slate-200 w-full sm:w-auto cursor-pointer'>
              See How It Works
            </Button>
          </a>
        </div>

        {/* Social Proof */}
        <div className='mt-16 pt-8 border-t border-slate-200/60 animate-in fade-in duration-1000 delay-500'>
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6'>
            Trusted by candidates hired at
          </p>
          <div className='flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-40 hover:opacity-70 transition-opacity duration-500'>
            <div className='flex items-center gap-2'>
              <div className='h-5 w-5 bg-slate-800 rounded-full'></div>
              <span className='font-bold text-lg'>Acme Inc</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-5 w-5 bg-slate-800 rounded-full'></div>
              <span className='font-bold text-lg'>Globex</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-5 w-5 bg-slate-800 rounded-full'></div>
              <span className='font-bold text-lg'>Soylent</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-5 w-5 bg-slate-800 rounded-full'></div>
              <span className='font-bold text-lg'>Umbrella</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
