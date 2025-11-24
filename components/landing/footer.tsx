import { Bot, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='bg-white pt-16 pb-8 border-t border-slate-200'>
      <div className='container mx-auto px-6 max-w-7xl'>
        <div className='grid md:grid-cols-4 gap-12 mb-12'>
          <div className='col-span-1 md:col-span-1'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center'>
                <Bot className='text-white h-5 w-5' />
              </div>
              <span className='font-bold text-xl text-slate-900'>Ollie</span>
            </div>
            <p className='text-slate-500 text-xs leading-relaxed mb-6'>
              The intelligent career architect helping you navigate the future
              of work with confidence.
            </p>
            <div className='flex gap-4'>
              <a
                href='#'
                className='text-slate-400 hover:text-slate-900 transition-colors'>
                <Twitter size={18} />
              </a>
              <a
                href='#'
                className='text-slate-400 hover:text-slate-900 transition-colors'>
                <Github size={18} />
              </a>
              <a
                href='#'
                className='text-slate-400 hover:text-slate-900 transition-colors'>
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className='font-bold text-slate-900 mb-4 text-sm'>Product</h4>
            <ul className='space-y-2 text-xs text-slate-600'>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Resume Builder
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Cover Letter AI
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Interview Coach
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-slate-900 mb-4 text-sm'>Resources</h4>
            <ul className='space-y-2 text-xs text-slate-600'>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Career Blog
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Resume Templates
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Cover Letter Examples
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Job Search Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-slate-900 mb-4 text-sm'>Company</h4>
            <ul className='space-y-2 text-xs text-slate-600'>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  About Us
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Contact
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-slate-400 text-xs'>
            © 2025 Ollie AI Inc. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <a href='#' className='text-slate-400 hover:text-slate-900 text-xs'>
              Privacy
            </a>
            <a href='#' className='text-slate-400 hover:text-slate-900 text-xs'>
              Terms
            </a>
            <a href='#' className='text-slate-400 hover:text-slate-900 text-xs'>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
