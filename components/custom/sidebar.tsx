'use client';
import { LayoutDashboard, PlusCircle, Bot } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { JobDescription } from '@/lib/types';
import { Item, ItemContent, ItemMedia, ItemTitle } from '../ui/item';

export default function Sidebar({
  recentJobs,
}: {
  recentJobs: JobDescription[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/job-entry', label: 'New Application', icon: PlusCircle },
  ];

  return (
    <aside className='w-60 bg-white border-r border-slate-200 hidden md:flex flex-col z-30 shrink-0'>
      <div
        className='h-12 flex items-center px-4 border-b border-slate-200 cursor-pointer'
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

      <div className='flex-1 flex flex-col overflow-hidden'>
        <nav className='p-2 space-y-0.5 border-b border-slate-100'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Item
                key={item.path}
                variant={isActive ? 'default' : 'muted'}
                size='sm'
                asChild>
                <a href={item.path}>
                  <ItemMedia>
                    <Icon className='size-5' />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{item.label}</ItemTitle>
                  </ItemContent>
                </a>
              </Item>
            );
          })}
        </nav>

        <div className='flex-1 overflow-y-auto px-2 py-3 custom-scrollbar'>
          <div className='flex items-center justify-between px-3 mb-2'>
            <span className='text-[10px] font-semibold uppercase text-slate-400 tracking-wider'>
              History
            </span>
          </div>

          <div className='space-y-0.5'>
            {recentJobs.length === 0 ? (
              <div className='px-3 py-4 text-center border border-dashed border-slate-100 rounded-md'>
                <p className='text-[10px] text-slate-400'>
                  No applications yet
                </p>
              </div>
            ) : (
              recentJobs.map((job) => {
                const jobPath = `/application/${job.id}`;
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
          </div>
        </div>
      </div>
      {/* Footer credits kept same */}
    </aside>
  );
}
