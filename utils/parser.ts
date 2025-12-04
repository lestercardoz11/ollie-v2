import { db } from '@/services/browser-client/db';
import { parseCareerDocumentWithGemini } from '@/services/gemini';
import { SupportingDocument, UserProfile } from '@/types/db';
import { toast } from 'sonner';

// Define the shape of an active upload tracker
export interface ActiveUpload {
  id: string;
  fileName: string;
  progress: number;
  status: string;
}

export const reparseAllDocuments = async (
  documents: SupportingDocument[],
  profile: UserProfile,
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
  setLastSavedProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
  uploadId?: string, // Optional uploadId to update status for a specific upload
  setActiveUploads?: React.Dispatch<React.SetStateAction<ActiveUpload[]>> // Optional setter for active uploads
): Promise<UserProfile> => {
  if (documents.length === 0) {
    console.log('No documents to parse. Profile remains unchanged.');
    return profile;
  }

  // Update progress for Analysis phase if an uploadId is provided
  setActiveUploads?.((prev) =>
    prev.map((upload) =>
      upload.id === uploadId
        ? {
            ...upload,
            progress: 40,
            status: 'Analyzing content with Gemini...',
          }
        : upload
    )
  );

  const documentUrls = documents.map((doc) => doc.file_url);

  // Assuming parseCareerDocumentWithGemini handles fetching the document content via the provided URLs/context
  const extracted = await parseCareerDocumentWithGemini(documentUrls, profile); // Cast to expected extraction type

  const updatedProfile: UserProfile = {
    ...profile,
    // Merge new extracted data, falling back to existing profile data if extraction is null/undefined
    full_name: extracted?.full_name || profile.full_name,
    location: extracted?.location || profile.location,
    phone: extracted?.phone || profile.phone,
    linkedin: extracted?.linkedin || profile.linkedin,
    portfolio: extracted?.portfolio || profile.portfolio,
    additional_info: extracted?.additional_info || profile.additional_info,
    summary: extracted?.summary || profile.summary,
    skills: extracted?.skills || profile.skills,
    experience: extracted?.experience || profile.experience,
    education: extracted?.education || profile.education,
    achievements: extracted?.achievements || profile.achievements,
  };

  console.log('Profile after document parsing:', updatedProfile);

  if (JSON.stringify(updatedProfile) !== JSON.stringify(profile)) {
    setProfile(() => {
      // Trigger async save
      db.saveProfile(updatedProfile).then(() =>
        setLastSavedProfile(updatedProfile)
      );
      return updatedProfile;
    });

    // Update status with extraction result
    setActiveUploads?.((prev) =>
      prev.map((upload) =>
        upload.id === uploadId
          ? {
              ...upload,
              progress: 100,
              status: `Profile updated with extracted data`,
            }
          : upload
      )
    );
    toast.success('Profile successfully updated with document analysis.');
  } else {
    // Completed but nothing new found
    setActiveUploads?.((prev) =>
      prev.map((upload) =>
        upload.id === uploadId
          ? { ...upload, progress: 100, status: 'Complete (No new data found)' }
          : upload
      )
    );
    toast.info('Document analyzed, but no new profile data was extracted.');
  }

  // Return the final profile state
  return updatedProfile;
};

export const uploadFileAndParse = async (
  file: File,
  documents: SupportingDocument[],
  setDocuments: React.Dispatch<React.SetStateAction<SupportingDocument[]>>,
  profile: UserProfile,
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
  setLastSavedProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
  setActiveUploads: React.Dispatch<React.SetStateAction<ActiveUpload[]>>
) => {
  const uploadId = Math.random().toString(36).substring(7);

  // Add to active uploads
  setActiveUploads((prev) => [
    ...prev,
    {
      id: uploadId,
      fileName: file.name,
      progress: 0,
      status: 'Uploading...',
    },
  ]);

  // Simulate progress
  const progressInterval = setInterval(() => {
    setActiveUploads((prev) =>
      prev.map((upload) => {
        if (upload.id !== uploadId || upload.progress >= 80) return upload;
        return { ...upload, progress: upload.progress + Math.random() * 10 };
      })
    );
  }, 500);

  try {
    const supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/msword', // doc
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!supportedTypes.includes(file.type)) {
      clearInterval(progressInterval);
      setActiveUploads((prev) =>
        prev.map((upload) =>
          upload.id === uploadId
            ? {
                ...upload,
                progress: 100,
                status: 'Complete (Type not supported)',
              }
            : upload
        )
      );
      toast.warning(`File type not supported for analysis: ${file.name}`);
      // Remove from active list after delay
      setTimeout(() => {
        setActiveUploads((prev) =>
          prev.filter((upload) => upload.id !== uploadId)
        );
      }, 4000);
      return;
    }

    // 1. Upload to DB (This assumes db.uploadDocument handles Supabase storage/database insertion)
    // NOTE: This is a placeholder for your existing db service call
    const newDoc = await db.uploadDocument(file);
    const updatedDocuments = [newDoc, ...documents];
    setDocuments(updatedDocuments);

    // 2. Trigger Reparsing of ALL documents, including the new one
    await reparseAllDocuments(
      updatedDocuments,
      profile,
      setProfile,
      setLastSavedProfile,
      uploadId,
      setActiveUploads
    );

    // Remove from active list after delay
    setTimeout(() => {
      setActiveUploads((prev) =>
        prev.filter((upload) => upload.id !== uploadId)
      );
    }, 4000);
  } catch (error: unknown) {
    clearInterval(progressInterval);
    if (error instanceof Error) {
      toast.error(
        `Upload failed for ${file.name}: ${error.message || 'Unknown error'}`
      );
    } else {
      console.error(error);
      toast.error(
        `Upload failed for ${file.name}: ${error || 'Unknown error'}`
      );
    }
    setActiveUploads((prev) => prev.filter((upload) => upload.id !== uploadId));
  }
};
