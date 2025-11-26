import ApplicationPackageView from '@/components/application-package';
import { db } from '@/services/db-server';
import { redirect } from 'next/navigation';

export default async function ApplicationPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [job, profile, existingApp] = await Promise.all([
    db.getJobById(id),
    db.getProfile(),
    db.getApplicationByJobId(id),
  ]);

  if (!profile) redirect('/dashboard');
  if (!job) redirect('/new-application');

  return (
    <ApplicationPackageView
      profile={profile}
      job={job}
      generatedApplication={existingApp}
    />
  );
}
