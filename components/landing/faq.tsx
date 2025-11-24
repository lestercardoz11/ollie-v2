export default function FAQ() {
  return (
    <section id='faq' className='py-24 bg-slate-50'>
      <div className='container mx-auto px-6 max-w-4xl'>
        <h2 className='text-3xl font-bold text-center text-slate-900 mb-12'>
          Frequently Asked Questions
        </h2>

        <div className='space-y-4'>
          <div className='bg-white rounded-xl border border-slate-200 p-6 shadow-sm'>
            <h3 className='font-bold text-slate-900 mb-2'>
              Does Ollie store my data?
            </h3>
            <p className='text-slate-600 text-sm'>
              Yes, securely. We use Supabase with Row Level Security, meaning
              only you can access your documents and profile data.
            </p>
          </div>
          <div className='bg-white rounded-xl border border-slate-200 p-6 shadow-sm'>
            <h3 className='font-bold text-slate-900 mb-2'>
              Is the CV ATS friendly?
            </h3>
            <p className='text-slate-600 text-sm'>
              Absolutely. We generate clean Markdown that can be exported to
              PDF. The formatting is designed specifically to be readable by
              Applicant Tracking Systems.
            </p>
          </div>
          <div className='bg-white rounded-xl border border-slate-200 p-6 shadow-sm'>
            <h3 className='font-bold text-slate-900 mb-2'>
              Can I edit the generated content?
            </h3>
            <p className='text-slate-600 text-sm'>
              Yes! Ollie gives you a solid first draft (usually 95% ready), but
              you can copy the text and make any final tweaks you want before
              exporting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
