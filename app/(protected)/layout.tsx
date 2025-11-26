import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { JobDescription, UserProfile } from '@/types/db';
import { db } from '@/services/db-server';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/custom/app-sidebar';

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
  const user: UserProfile | null = await db.getProfile();

  if (!user) {
    supabase.auth.signOut();
    redirect('/');
  }

  return (
    <SidebarProvider>
      <div className='flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans'>
        <AppSidebar user={user} recentJobs={jobs} />

        <SidebarInset>
          <div className='flex-1 flex flex-col h-full min-w-0'>
            {/* <Header payload={data.claims} /> */}
            <main className='flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 scroll-smooth'>
              <div className='container mx-auto p-4 md:p-5 max-w-6xl min-h-full'>
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
