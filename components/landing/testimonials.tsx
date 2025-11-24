import { Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section
      id='testimonials'
      className='py-24 bg-white border-y border-slate-100'>
      <div className='container mx-auto px-6 max-w-7xl'>
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-1 mb-3'>
            <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
            <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
            <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
            <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
            <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-slate-900 mb-4'>
            Loved by ambitious professionals
          </h2>
          <p className='text-slate-600'>
            Join thousands of users who are upgrading their careers.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          <div className='p-8 bg-slate-50 rounded-2xl border border-slate-100'>
            <p className='text-slate-700 italic mb-6 text-sm leading-relaxed'>
              {`"I used to spend hours customizing my resume for every single
                  tech job. Ollie does it in seconds, and the quality is
                  honestly better than what I was writing myself."`}
            </p>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold'>
                SJ
              </div>
              <div>
                <p className='font-bold text-slate-900 text-sm'>
                  Sarah Jenkins
                </p>
                <p className='text-xs text-slate-500'>
                  Product Manager @ Spotify
                </p>
              </div>
            </div>
          </div>

          <div className='p-8 bg-slate-50 rounded-2xl border border-slate-100'>
            <p className='text-slate-700 italic mb-6 text-sm leading-relaxed'>
              {`"The Interview Prep feature is a game changer. It predicted 2
                  of the exact technical questions I got asked in my final
                  round. I felt so prepared."`}
            </p>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold'>
                MT
              </div>
              <div>
                <p className='font-bold text-slate-900 text-sm'>Mike Torres</p>
                <p className='text-xs text-slate-500'>Senior Dev @ Startup</p>
              </div>
            </div>
          </div>

          <div className='p-8 bg-slate-50 rounded-2xl border border-slate-100'>
            <p className='text-slate-700 italic mb-6 text-sm leading-relaxed'>
              {`"English isn't my first language, so writing cover letters was
                  always stressful. Ollie helps me sound professional,
                  confident, and native."`}
            </p>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold'>
                EL
              </div>
              <div>
                <p className='font-bold text-slate-900 text-sm'>Elena Li</p>
                <p className='text-xs text-slate-500'>UX Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
