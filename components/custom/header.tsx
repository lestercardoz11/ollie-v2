'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { JwtPayload } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface HeaderProps {
  payload: JwtPayload | null;
}

export const Header: React.FC<HeaderProps> = ({ payload }) => {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!payload || !payload.email) return 'U';
    return payload.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className='h-12 bg-white border-b border-slate-200 flex items-center justify-end px-6 sticky top-0 z-20'>
      <div className='relative' ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center justify-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-1 hover:ring-2 hover:ring-slate-100'
          title='Account Menu'>
          <div className='h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-blue-200 cursor-pointer'>
            {getInitials()}
          </div>
        </button>

        {isOpen && (
          <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50'>
            <div className='px-4 py-3 border-b border-slate-50'>
              <p className='text-xs font-semibold text-slate-900 truncate'>
                {payload?.email}
              </p>
              <p className='text-[10px] text-slate-500'>Free Plan</p>
            </div>

            <button
              onClick={() => {
                router.push('/profile');
                setIsOpen(false);
              }}
              className='w-full flex items-center gap-3 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors'>
              <User size={14} />
              My Profile
            </button>

            <button
              onClick={() => {
                router.push('/settings');
                setIsOpen(false);
              }}
              className='w-full flex items-center gap-3 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors'>
              <Settings size={14} />
              Settings
            </button>

            <div className='h-px bg-slate-100 my-1'></div>

            <button
              onClick={handleLogout}
              className='w-full flex items-center gap-3 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors'>
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
