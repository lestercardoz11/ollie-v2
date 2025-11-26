'use client';

import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { JwtPayload } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface HeaderProps {
  payload: JwtPayload | null;
}

export const Header: React.FC<HeaderProps> = ({ payload }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getInitials = () => {
    if (!payload || !payload.email) return 'U';
    return payload.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className='sticky top-0 z-20 h-12 bg-white border-b border-slate-200 flex items-center justify-end px-10'>
      <DropdownMenu>
        <DropdownMenuTrigger className='focus:outline-none'>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuLabel className='text-xs'>
            {payload?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => router.push('/profile')}>
            <User />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => router.push('/settings')}>
            <Settings />
            Settings
          </DropdownMenuItem>{' '}
          <DropdownMenuSeparator />
          <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
            <LogOut />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
