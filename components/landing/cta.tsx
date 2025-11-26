import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function CTA() {
  const router = useRouter();
  return (
    <section className='py-24 bg-white relative overflow-hidden'>
      <div className='container mx-auto px-6 max-w-4xl text-center relative z-10'>
        <div className='bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 md:p-20 text-white shadow-2xl shadow-blue-900/20'>
          <h2 className='text-3xl md:text-5xl font-bold mb-6'>
            Ready to upgrade your career?
          </h2>
          <p className='text-blue-100 text-lg mb-10 max-w-2xl mx-auto'>
            Join thousands of candidates who are landing interviews 3x faster
            with Ollie.
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Button
              size='lg'
              variant='secondary'
              className='text-blue-700 border-0 h-14 px-8 text-base font-bold bg'
              onClick={() => router.push('/auth/sign-up')}>
              Start For Free
            </Button>
            <p className='mt-4 sm:mt-0 sm:self-center text-blue-200 text-xs'>
              No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
