import { CheckCircle, X } from 'lucide-react';

export default function Problem() {
  return (
    <section className='py-20 bg-white border-y border-slate-100'>
      <div className='container mx-auto px-6 max-w-5xl'>
        <div className='text-center mb-12'>
          <h2 className='text-2xl md:text-3xl font-bold text-slate-900'>
            {`Why you're not getting callbacks`}
          </h2>
          <p className='text-slate-500 mt-2'>
            The hiring landscape has changed. Generic applications get filtered
            out.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* The Old Way */}
          <div className='bg-slate-50 rounded-2xl p-8 border border-slate-100 relative overflow-hidden'>
            <div className='absolute top-0 right-0 p-4 opacity-10 text-red-500'>
              <X size={120} />
            </div>
            <h3 className='text-lg font-bold text-slate-900 mb-6 flex items-center gap-2'>
              <span className='bg-red-100 text-red-600 p-1 rounded'>
                The Old Way
              </span>
            </h3>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3 text-slate-600'>
                <X className='h-5 w-5 text-red-500 shrink-0 mt-0.5' />
                <span>Spending 2 hours tweaking one CV for one job.</span>
              </li>
              <li className='flex items-start gap-3 text-slate-600'>
                <X className='h-5 w-5 text-red-500 shrink-0 mt-0.5' />
                <span>{`Using "To Whom It May Concern" templates.`}</span>
              </li>
              <li className='flex items-start gap-3 text-slate-600'>
                <X className='h-5 w-5 text-red-500 shrink-0 mt-0.5' />
                <span>Guessing what keywords the ATS is looking for.</span>
              </li>
              <li className='flex items-start gap-3 text-slate-600'>
                <X className='h-5 w-5 text-red-500 shrink-0 mt-0.5' />
                <span>
                  Panicking when asked unexpected interview questions.
                </span>
              </li>
            </ul>
          </div>

          {/* The Ollie Way */}
          <div className='bg-blue-50/50 rounded-2xl p-8 border border-blue-100 relative overflow-hidden shadow-sm'>
            <div className='absolute top-0 right-0 p-4 opacity-10 text-blue-500'>
              <CheckCircle size={120} />
            </div>
            <h3 className='text-lg font-bold text-slate-900 mb-6 flex items-center gap-2'>
              <span className='bg-blue-100 text-blue-700 p-1 rounded'>
                The Ollie Way
              </span>
            </h3>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3 text-slate-700'>
                <CheckCircle className='h-5 w-5 text-blue-600 shrink-0 mt-0.5' />
                <span>Generating a tailored, keyword-optimized CV in 30s.</span>
              </li>
              <li className='flex items-start gap-3 text-slate-700'>
                <CheckCircle className='h-5 w-5 text-blue-600 shrink-0 mt-0.5' />
                <span>
                  Narrative-driven cover letters that show your value.
                </span>
              </li>
              <li className='flex items-start gap-3 text-slate-700'>
                <CheckCircle className='h-5 w-5 text-blue-600 shrink-0 mt-0.5' />
                <span>Smart gap analysis comparing your skills to the JD.</span>
              </li>
              <li className='flex items-start gap-3 text-slate-700'>
                <CheckCircle className='h-5 w-5 text-blue-600 shrink-0 mt-0.5' />
                <span>AI Career Coach prepping you with specific answers.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
