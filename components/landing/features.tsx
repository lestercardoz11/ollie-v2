import {
  Layers,
  FileText,
  Target,
  Shield,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export default function Features() {
  return (
    <section id='features' className='py-24 bg-slate-50'>
      <div className='container mx-auto px-6 max-w-7xl'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-slate-900 mb-4'>
            Your Personal Career HQ
          </h2>
          <p className='text-slate-600 max-w-2xl mx-auto'>
            {`Ollie isn't just a writer; it's a strategist that organizes your
                career data and deploys it effectively.`}
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {/* Feature 1 */}
          <div className='group p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300'>
            <div className='w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <Layers size={24} />
            </div>
            <h3 className='text-lg font-bold mb-3 text-slate-900'>
              Contextual Resume Tailoring
            </h3>
            <p className='text-sm text-slate-600 leading-relaxed'>
              Ollie intelligently rewrites your bullet points to align with the
              job description, highlighting the exact skills recruiters are
              scanning for.
            </p>
          </div>

          {/* Feature 2 */}
          <div className='group p-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300'>
            <div className='w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <FileText size={24} />
            </div>
            <h3 className='text-lg font-bold mb-3 text-slate-900'>
              Narrative Cover Letters
            </h3>
            <p className='text-sm text-slate-600 leading-relaxed'>
              {`Ditch the templates. Ollie drafts unique, persuasive cover
                  letters that connect your specific achievements to the
                  company's mission and values.`}
            </p>
          </div>

          {/* Feature 3 */}
          <div className='group p-8 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300'>
            <div className='w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <Target size={24} />
            </div>
            <h3 className='text-lg font-bold mb-3 text-slate-900'>
              Interview Cheat Sheets
            </h3>
            <p className='text-sm text-slate-600 leading-relaxed'>
              {`Walk into interviews confident. Ollie predicts the questions
                  you'll be asked and drafts strong STAR-method responses based
                  on your history.`}
            </p>
          </div>

          {/* Feature 4 */}
          <div className='group p-8 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300'>
            <div className='w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <Briefcase size={24} />
            </div>
            <h3 className='text-lg font-bold mb-3 text-slate-900'>
              Job Match Scoring
            </h3>
            <p className='text-sm text-slate-600 leading-relaxed'>
              {`Don't waste time on bad fits. Ollie scores every job
                  description against your profile so you know where you have
                  the highest chance of success.`}
            </p>
          </div>

          {/* Feature 5 */}
          <div className='group p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300'>
            <div className='w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <GraduationCap size={24} />
            </div>
            <h3 className='text-lg font-bold mb-3 text-slate-900'>
              Supporting Docs Parsing
            </h3>
            <p className='text-sm text-slate-600 leading-relaxed'>
              Upload portfolios, certificates, and transcripts. Ollie extracts
              hidden skills and adds them to your profile automatically.
            </p>
          </div>

          {/* Feature 6 */}
          <div className='group p-8 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300'>
            <div className='w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <Shield size={24} />
            </div>
            <h3 className='text-lg font-bold mb-3 text-slate-900'>
              Private & Secure
            </h3>
            <p className='text-sm text-slate-600 leading-relaxed'>
              Your data is yours. We use enterprise-grade encryption and RLS
              security. Your career history is never shared with employers
              without your action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
