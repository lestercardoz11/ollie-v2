import ProfileView from '@/components/profile';
import { db } from '@/services/db-server';

export default async function ProfilePage() {
  const [savedProfile, savedDocs] = await Promise.all([
    db.getProfile(),
    db.getDocuments(),
  ]);

  return <ProfileView userProfile={savedProfile} documents={savedDocs} />;
}
