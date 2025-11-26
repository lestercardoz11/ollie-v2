'use client';

import { useState, useMemo } from 'react';
import { Save, Pencil, Ban } from 'lucide-react';
import { db } from '../services/db';
import { UserProfile, SupportingDocument } from '../lib/types';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { ResumeImport } from './profile/resume-import';
import { PersonalDetails } from './profile/personal-details';
import { SupportingDocuments } from './profile/supporting-documents';
import { Skills } from './profile/skills';
import { Achievements } from './profile/achievements';
import { ProfessionalSummary } from './profile/professional-summary';
import { Experience } from './profile/experience';
import { Education } from './profile/education';
import { AdditionalInformation } from './profile/additional-information';
import { MainContainer } from './custom/main-container';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  documents: SupportingDocument[];
}

export default function ProfileView({
  userProfile,
  documents,
}: ProfileViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<UserProfile>(
    userProfile || {
      id: '',
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      experience: [],
      education: [],
      achievements: [],
      skills: { technical: [], soft: [], keywords: [] },
      additionalInfo: '',
    }
  );

  // Store the last saved version to check for changes and revert
  const [lastSavedProfile, setLastSavedProfile] = useState<UserProfile>(
    userProfile || {
      id: '',
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      experience: [],
      education: [],
      achievements: [],
      skills: { technical: [], soft: [], keywords: [] },
      additionalInfo: '',
    }
  );

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
      setIsEditing(false); // Exit edit mode on save
      toast.success('Profile saved successfully!');
    } catch (e) {
      console.error(e);
      toast.success('Failed to save profile. Please try again.');
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
      {/* Header Section */}
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

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
        {/* Left Column - Sources & Personal Info */}
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

          {/* Personal Details Card */}
          <PersonalDetails
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
          />

          {/* Skills Card - Categorized */}
          <Skills
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

        {/* Right Column - Experience & Summary */}
        <div className='lg:col-span-8 space-y-4'>
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

          {/* Additional Information */}
          <AdditionalInformation
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
          />
        </div>
      </div>
    </MainContainer>
  );
}
