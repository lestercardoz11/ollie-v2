import {
  UserProfile,
  JobDescription,
  GeneratedApplication,
  TailoredCV,
  Chat,
  Message,
  SupportingDocument,
} from './db';

// --- 1. APPLICATION JOIN TYPES ---

/**
 * Represents a GeneratedApplication joined with its core associated records:
 * The Job Description and the Tailored CV data.
 */
export interface ApplicationWithDetails
  extends Omit<GeneratedApplication, 'job' | 'tailored_cv' | 'chat'> {
  // Now explicitly define the joined fields
  job: JobDescription;
  tailored_cv: TailoredCV;
  chat: Chat | null;
}
/**
 * Represents a Tailored CV record, which contains the resume content
 * (experience, education, etc. stored as JSONB)
 */
export interface TailoredCVWithUser extends Omit<TailoredCV, 'user_id'> {
  user_id: UserProfile;
}

// --- 2. CHAT JOIN TYPES ---

/**
 * Represents a single Chat session joined with all of its Message history.
 * Used when loading a specific chat for display.
 */
export interface ChatWithMessages extends Chat {
  // Joins from the 'chats' table
  messages: Message[]; // Supabase pluralizes the join result
}

/**
 * Represents a single Message joined with the associated User Profile (if user-sent).
 * Useful for displaying message senders.
 */
export interface MessageWithUser extends Omit<Message, 'user'> {
  // Joins from the 'messages' table {
  // Joins from the 'messages' table (via user_id)
  user: UserProfile | null;
}

// --- 3. PROFILE JOIN TYPES ---

/**
 * Represents a UserProfile joined with all related Job Descriptions created by that user.
 */
export interface UserProfileWithJobs extends UserProfile {
  // Joins from the 'user_profiles' table
  job_descriptions: JobDescription[];
}

/**
 * Represents a UserProfile joined with all uploaded Supporting Documents.
 */
export interface UserProfileWithDocuments extends UserProfile {
  // Joins from the 'user_profiles' table
  supporting_documents: SupportingDocument[];
}
