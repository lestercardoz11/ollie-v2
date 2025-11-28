import ProfileView from '@/components/profile';
import { db } from '@/services/server-client/db';

export default async function ProfilePage() {
  const [savedProfile, savedDocs] = await Promise.all([
    db.getProfile(),
    db.getDocuments(),
  ]);

  const skills = await db.getSkillsByIds(savedProfile?.skills || []);

  return (
    <ProfileView
      userProfile={savedProfile}
      documents={savedDocs}
      skills={skills}
    />
  );
}
