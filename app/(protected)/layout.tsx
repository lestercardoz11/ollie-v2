import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import Sidebar from '@/components/custom/sidebar';
import { Header } from '@/components/custom/header';
import { JobDescription } from '@/lib/types';
import { db } from '@/services/db-server';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/');
  }

  const jobs: JobDescription[] = await db.getJobs();

  return (
    <div className='flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans'>
      <Sidebar recentJobs={jobs} />
      <div className='flex-1 flex flex-col h-full min-w-0'>
        <Header payload={data.claims} />
        <main className='flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 scroll-smooth'>
          <div className='container mx-auto p-4 md:p-5 max-w-6xl min-h-full'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
