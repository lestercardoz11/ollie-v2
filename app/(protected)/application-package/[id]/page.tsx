import ApplicationPackageView from '@/components/application-package';
import { db } from '@/services/server-client/db';
import { redirect } from 'next/navigation';

export default async function ApplicationPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [job, profile] = await Promise.all([
    db.getJobById(id),
    db.getProfile(),
  ]);

  if (!profile) redirect('/dashboard');
  if (!job) redirect('/new-application');

  return (
    <ApplicationPackageView
      profile={profile}
      job={job}
      generatedApplication={await db.getApplicationWithDetails(job.id)}
    />
  );
}
