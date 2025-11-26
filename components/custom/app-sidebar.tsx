'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { JobDescription, UserProfile } from '@/types/db';
import { LayoutDashboard, PlusCircle, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NavMain } from './nav-main';
import { NavContent } from './nav-content';
import { NavUser } from './nav-user';

export default function AppSidebar({
  user,
  recentJobs,
}: {
  user: UserProfile;
  recentJobs: JobDescription[];
}) {
  const router = useRouter();

  const navItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'New Application',
      url: '/new-application',
      icon: PlusCircle,
    },
  ];

  return (
    <Sidebar className='border-slate-200'>
      <SidebarHeader>
        <div
          className='h-12 flex items-center px-2 border-b border-slate-200 cursor-pointer'
          onClick={() => router.push('/')}>
          <div className='flex items-center gap-2'>
            <div className='h-6 w-6 bg-blue-600 rounded-md flex items-center justify-center shadow-sm shadow-blue-200'>
              <Bot className='text-white h-3.5 w-3.5' />
            </div>
            <span className='font-bold text-sm tracking-tight text-slate-900'>
              Ollie
            </span>
          </div>
        </div>

        <NavMain items={navItems} />
      </SidebarHeader>
      <SidebarContent>
        <NavContent
          items={recentJobs.map((job) => ({
            title: job.title,
            url: `/application-package/${job.id}`,
          }))}>
          <SidebarGroupLabel>History</SidebarGroupLabel>
        </NavContent>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: user.full_name, email: user.email }} />
      </SidebarFooter>
    </Sidebar>
  );
}
