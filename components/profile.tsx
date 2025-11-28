'use client';

import { useState, useMemo } from 'react';
import { Save, Pencil, Ban } from 'lucide-react';
import { db } from '../services/browser-client/db';
import { UserProfile, SupportingDocument, Skill } from '../types/db';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { MainContainer } from './custom/main-container';
import { ResumeImport } from './profile/resume-import';
import { SupportingDocuments } from './profile/supporting-documents';
import { PersonalDetails } from './profile/personal-details';
import { Skills } from './profile/skills';
import { Education } from './profile/education';
import { Achievements } from './profile/achievements';
import { ProfessionalSummary } from './profile/professional-summary';
import { Experience } from './profile/experience';
import { AdditionalInformation } from './profile/additional-information';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  documents: SupportingDocument[];
  skills: Skill[];
}

export default function ProfileView({
  userProfile,
  documents,
  skills,
}: ProfileViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const initialProfileState: UserProfile = {
    id: userProfile?.id || '',
    user_id: userProfile?.user_id || '',
    full_name: userProfile?.full_name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    location: userProfile?.location || null,
    summary: userProfile?.summary || null,
    resume_url: userProfile?.resume_url || null,
    profile_picture_url: userProfile?.profile_picture_url || null,
    additional_info: userProfile?.additional_info || null,
    linkedin: userProfile?.linkedin || null,
    portfolio: userProfile?.portfolio || null,
    created_at: userProfile?.created_at || '',
    experience: userProfile?.experience || [],
    education: userProfile?.education || [],
    achievements: userProfile?.achievements || [],
    skills: userProfile?.skills || [],
  };

  const [profile, setProfile] = useState<UserProfile>(initialProfileState);
  const [lastSavedProfile, setLastSavedProfile] =
    useState<UserProfile>(initialProfileState);

  const isDirty = useMemo(() => {
    if (!lastSavedProfile) return false;
    return JSON.stringify(profile) !== JSON.stringify(lastSavedProfile);
  }, [profile, lastSavedProfile]);

  // ------------------- Profile CRUD Handlers -------------------

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await db.saveProfile(profile);
      setLastSavedProfile(profile);
      setIsEditing(false);
      toast.success('Profile saved successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save profile. Please try again.'); // Changed to error
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    if (isDirty) {
      if (confirm('Discard unsaved changes?')) {
        if (lastSavedProfile) setProfile(lastSavedProfile);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <MainContainer>
      {/* Header Section (No changes needed here) */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3'>
        <div>
          <h1 className='text-lg font-bold text-slate-900 tracking-tight'>
            Profile
          </h1>
          <p className='text-slate-500 text-xs mt-0.5'>
            Manage the data ollie uses to tailor your applications.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {isEditing ? (
            <>
              <Button
                variant='secondary'
                size='sm'
                onClick={cancelEdit}
                className='opacity-80 hover:opacity-100'>
                <Ban className='mr-2 h-3 w-3' />
                Cancel
              </Button>
              <Button
                onClick={saveProfile}
                disabled={isSaving}
                size='sm'
                className='shadow-sm'>
                <Save className='mr-2 h-3 w-3' />
                {isSaving ? <Spinner /> : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button size='sm' onClick={() => setIsEditing(true)}>
              <Pencil className='mr-2 h-3 w-3' />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      {/* Main Content Grid (No changes needed in component props as the `profile` object structure is locally corrected) */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
        <div className='lg:col-span-4 space-y-4'>
          {/* Resume Import Card */}
          <ResumeImport
            profile={profile}
            setProfile={setProfile}
            setLastSavedProfile={setLastSavedProfile}
          />
          {/* Supporting Documents Section */}
          <SupportingDocuments
            supportingDocuments={documents}
            setProfile={setProfile}
            setLastSavedProfile={setLastSavedProfile}
          />

          {/* Skills Card - Categorized */}
          <Skills
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
            skills={skills}
          />

          {/* Additional Information */}
          <AdditionalInformation
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
          />
        </div>
        <div className='lg:col-span-8 space-y-4'>
          {/* Personal Details Card */}
          <PersonalDetails
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
          />

          {/* Professional Summary Section */}
          <ProfessionalSummary
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
          />
          {/* Work Experience Section */}
          <Experience
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
          />
          {/* Education Section */}
          <Education
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
          />
          {/* Achievements Section */}
          <Achievements
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
          />
        </div>
      </div>
    </MainContainer>
  );
}
