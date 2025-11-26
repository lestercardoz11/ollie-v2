import DashboardView from '@/components/dashboard';
import { GeneratedApplication, JobDescription, UserProfile } from '@/types/db';
import { db } from '@/services/db-server';

export default async function DashboardPage() {
  const [jobsData, appsData, profileData] = await Promise.all([
    db.getJobs(),
    db.getApplications(),
    db.getProfile(),
  ]);
  const jobs: JobDescription[] | [] = jobsData || [];
  const apps: GeneratedApplication[] = appsData || [];
  const profile: UserProfile | null = profileData || null;

  const data: {
    jobs: JobDescription[];
    apps: GeneratedApplication[];
    profile: UserProfile | null;
  } = { jobs, apps, profile };

  return <DashboardView {...data} />;
}
