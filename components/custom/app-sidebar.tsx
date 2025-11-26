'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { JobDescription } from '@/lib/types';
import { LayoutDashboard, PlusCircle, Bot } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Item, ItemContent, ItemMedia, ItemTitle } from '../ui/item';
import { NavMain } from './nav-main';

export default function AppSidebar({
  recentJobs,
}: {
  recentJobs: JobDescription[];
}) {
  const router = useRouter();
  const pathname = usePathname();

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
    <Sidebar className='border-r-0'>
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
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            {recentJobs.length === 0 ? (
              <div className='px-3 py-4 text-center border border-dashed border-slate-100 rounded-md'>
                <p className='text-[10px] text-slate-400'>
                  No applications yet
                </p>
              </div>
            ) : (
              recentJobs.map((job) => {
                const jobPath = `/application-package/${job.id}`;
                const isActive = pathname === jobPath;
                return (
                  <Link
                    key={job.id}
                    href={jobPath}
                    className={`w-full block text-left px-3 py-2 rounded-md text-xs transition-colors group relative ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}>
                    <div className='truncate pr-2'>{job.title}</div>
                    <div className='truncate text-[10px] text-slate-400 group-hover:text-slate-500'>
                      {job.company || 'Unknown'}
                    </div>
                    {isActive && (
                      <div className='absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-blue-600 rounded-r-full'></div>
                    )}
                  </Link>
                );
              })
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
