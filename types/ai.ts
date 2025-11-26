import { Achievement, Education, MessageRole, WorkExperience } from './db';

export type WritingTone =
  | 'professional'
  | 'confident'
  | 'enthusiastic'
  | 'concise'
  | 'creative';

// Define the temporary structure for Q&A which is part of the generation
export interface QAResponse {
  question: string;
  answer: string;
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

// Define the Parsed Data structure that comes *out* of the AI model
// This structure is often temporary and needs to be mapped to the DB models (like TailoredCV)
// It mirrors the JSON schema defined in parseResumeWithGemini.
export interface ParsedResumeData {
  full_name: string; // Updated to snake_case for consistency, though 'fullName' is still often used in prompt-based parsing
  summary: string;
  skills: {
    technical: string[];
    soft: string[];
    keywords: string[];
  };
  experience: WorkExperience[]; // Use Omit as Gemini doesn't generate the UUID
  education: Education[];
  achievements: Achievement[];
}
