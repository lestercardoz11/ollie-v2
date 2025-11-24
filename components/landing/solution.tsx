export default function Solution() {
  return (
    <section
      id='how-it-works'
      className='py-24 bg-slate-900 text-white relative overflow-hidden'>
      <div className='absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2'></div>

      <div className='container mx-auto px-6 max-w-7xl relative z-10'>
        <div className='mb-16 text-center md:text-left'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            From JD to Applied in minutes.
          </h2>
          <p className='text-slate-400 max-w-xl'>
            A simple, streamlined workflow designed for speed.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-12 relative'>
          <div className='hidden md:block absolute top-8 left-[5%] right-[30%] h-0.5 bg-slate-800 z-0'></div>

          <div className='relative z-10 text-center md:text-left group'>
            <div className='w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-blue-400 mb-6 shadow-xl mx-auto md:mx-0 group-hover:bg-slate-700 transition-colors'>
              1
            </div>
            <h3 className='text-xl font-bold mb-2'>Upload Profile</h3>
            <p className='text-slate-400 text-sm leading-relaxed'>
              Drag & drop your existing PDF resume. Ollie extracts your skills,
              experience, and education automatically.
            </p>
          </div>

          <div className='relative z-10 text-center md:text-left group'>
            <div className='w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-blue-400 mb-6 shadow-xl mx-auto md:mx-0 group-hover:bg-slate-700 transition-colors'>
              2
            </div>
            <h3 className='text-xl font-bold mb-2'>Target Job</h3>
            <p className='text-slate-400 text-sm leading-relaxed'>
              Paste the LinkedIn or Indeed job description. Ollie analyzes the
              gaps between your profile and the role.
            </p>
          </div>

          <div className='relative z-10 text-center md:text-left group'>
            <div className='w-16 h-16 rounded-2xl bg-blue-600 border border-blue-500 flex items-center justify-center text-xl font-bold text-white mb-6 shadow-xl shadow-blue-900/50 mx-auto md:mx-0 group-hover:scale-105 transition-transform'>
              3
            </div>
            <h3 className='text-xl font-bold mb-2'>Generate & Apply</h3>
            <p className='text-slate-400 text-sm leading-relaxed'>
              Get a downloadable package containing your new tailored CV, Cover
              Letter, and Interview cheat sheet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
