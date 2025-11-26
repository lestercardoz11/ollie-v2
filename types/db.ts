// --- ENUMS & UTILITY TYPES ---

/**
 * Maps directly to the PostgreSQL ENUM `skill_category_enum`.
 */
export type SkillCategory = 'technical' | 'soft' | 'keywords';

/**
 * Maps directly to the PostgreSQL ENUM `message_role_enum`.
 */
export type MessageRole = 'user' | 'assistant';

// --- INDEPENDENT DATA STRUCTURES (used within JSONB fields or in dedicated tables) ---

/**
 * Used for the master 'skills' table.
 */
export interface Skill {
  id: string; // UUID
  name: string;
  category: SkillCategory;
}

/**
 * Data structure for a single work experience entry.
 * Note: These fields are stored as part of a JSONB array in TailoredCV.
 */
export interface WorkExperience {
  company: string;
  role: string;
  startDate: string; // ISO Date String
  endDate: string; // ISO Date String or 'Present'
  description: string;
}

/**
 * Data structure for a single education entry.
 * Note: These fields are stored as part of a JSONB array in TailoredCV.
 */
export interface Education {
  school: string;
  degree: string;
  year: string;
}

/**
 * Data structure for a single achievement entry.
 * Note: These fields are stored as part of a JSONB array in TailoredCV.
 */
export interface Achievement {
  title: string;
  date: string; // ISO Date String
  description: string;
}

// --- SUPABASE TABLE INTERFACES ---

/**
 * Represents a row in the 'user_profiles' table.
 * Note: Complex arrays (experience, education) are not stored here directly
 * but were intended for the TailoredCV structure in the schema.
 */
export interface UserProfile {
  id: string; // UUID of the profile
  user_id: string; // UUID from auth.users
  full_name: string; // snake_case from DB
  email: string;
  phone: string | null;
  location: string | null;
  summary: string | null;
  resume_url: string | null; // Mapped from DB 'resume_url'
  profile_picture_url: string | null; // Mapped from DB 'profile_picture_url'
  additional_info: string | null;
  linkedin: string | null;
  portfolio: string | null;
  experience: WorkExperience[] | [];
  education: Education[] | [];
  achievements: Achievement[] | [];
  skills: string[] | [];
  created_at: string; // ISO Date String
}

/**
 * Represents a row in the 'job_descriptions' table.
 */
export interface JobDescription {
  id: string; // UUID
  title: string;
  company: string;
  raw_text: string;
  created_at: string;
}

/**
 * Represents a row in the 'supporting_documents' table.
 */
export interface SupportingDocument {
  id: string; // UUID
  user_id: string;
  name: string;
  file_url: string; // Mapped from DB 'file_url'
  file_type: string;
  created_at: string;
}

/**
 * Represents a row in the 'tailored_cvs' table.
 * The core data is stored in JSONB fields, matching the original array intent.
 */
export interface TailoredCV {
  id: string; // UUID
  user_id: string;
  summary: string | null;
  experience: WorkExperience[] | null;
  education: Education[] | null;
  achievements: Achievement[] | null;
  skills: Skill[] | null;
  created_at: string;
}

/**
 * Represents a row in the 'chats' table.
 */
export interface Chat {
  id: string; // UUID
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a row in the 'messages' table.
 */
export interface Message {
  id: string; // UUID
  chat_id: string;
  user_id: string | null; // Nullable if assistant/system role
  role: MessageRole;
  content: string;
  created_at: string;
}

/**
 * Represents a row in the 'generated_applications' table.
 */
export interface GeneratedApplication {
  id: string; // UUID
  job_id: string; // Mapped from DB 'job_id'
  user_id: string; // Mapped from DB 'profile_id'
  tailored_cv_id: string | null; // Mapped from DB 'tailored_cv_id'
  cover_letter_markdown: string | null; // Mapped from DB 'cover_letter_markdown'
  chat_id: string | null; // Mapped from DB 'chat_id'
  created_at: string;
}

// AI Service Types
