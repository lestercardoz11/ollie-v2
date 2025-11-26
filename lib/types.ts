export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface SkillCategories {
  technical: string[];
  soft: string[];
  keywords: string[];
}

export interface SupportingDocument {
  id: string;
  userId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  achievements: Achievement[];
  skills: SkillCategories; // Updated from string[]
  additionalInfo?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  rawText: string;
  createdAt: string;
}

export interface GeneratedApplication {
  id: string;
  jobId: string;
  profileId: string;
  tailoredCv: string; // Markdown
  coverLetter: string; // Markdown
  qaResponses: QAResponse[];
  createdAt: string;
}

export interface QAResponse {
  question: string;
  answer: string;
}

export type WritingTone =
  | 'professional'
  | 'confident'
  | 'enthusiastic'
  | 'concise'
  | 'creative';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// AI Service Types
export interface ParsedProfileData {
  fullName?: string;
  summary?: string;
  experience?: WorkExperience[];
  education?: Education[];
  achievements?: Achievement[];
  skills?: SkillCategories;
}
