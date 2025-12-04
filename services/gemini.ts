import { GoogleGenAI, Type } from '@google/genai';
import {
  generateApplicationPrompt,
  generateChatSystemInstruction,
  analyzeProfileUpdatePrompt,
  SYSTEM_UNIVERSAL_PARSER,
} from '../lib/prompts';
import { JobDescription, UserProfile, Message, TailoredCV } from '@/types/db';
import { ParsedResumeData, QAResponse, WritingTone } from '@/types/ai';
import { jsonrepair } from 'jsonrepair';
import { retrieveFilesAndGenerateContext } from '@/utils/file';

// Initialize Client
// NOTE: API Key must be set in the execution environment or retrieved securely.
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
});

/**
 * Helper to map raw API errors to user-friendly messages with detailed logging.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleGeminiError = (error: any, context: string): never => {
  console.group(`🚨 Gemini API Error: ${context}`);
  console.error('Error Object:', error);
  if (error && typeof error === 'object' && 'status' in error) {
    console.error('HTTP Status:', error.status);
    console.error('Status Text:', error.statusText);
  }
  console.groupEnd();

  const rawMsg = error?.message || error?.toString() || '';
  let friendlyMsg = rawMsg;

  if (rawMsg.includes('401') || rawMsg.includes('API key')) {
    friendlyMsg =
      'Authentication failed: Invalid API Key. Please check your settings.';
  } else if (
    rawMsg.includes('429') ||
    rawMsg.includes('quota') ||
    rawMsg.includes('resource exhausted')
  ) {
    friendlyMsg =
      'Usage limit exceeded. The AI service is currently busy. Please try again in a few minutes.';
  } else if (
    rawMsg.includes('500') ||
    rawMsg.includes('503') ||
    rawMsg.includes('overloaded')
  ) {
    friendlyMsg =
      'The AI service is temporarily unavailable. Please try again later.';
  } else if (rawMsg.includes('safety') || rawMsg.includes('blocked')) {
    friendlyMsg =
      'Content blocked by safety filters. Please ensure the document contains appropriate professional content.';
  } else if (rawMsg.includes('JSON') || rawMsg.includes('SyntaxError')) {
    friendlyMsg =
      'Failed to interpret the document. The AI response was malformed. Please ensure the document is readable.';
  } else if (rawMsg.includes('Candidate was stopped')) {
    friendlyMsg =
      'The analysis was stopped unexpectedly by the AI model. Please try again.';
  } else if (!friendlyMsg || friendlyMsg === '[object Object]') {
    friendlyMsg =
      'An unknown error occurred while communicating with the AI service.';
  }

  throw new Error(friendlyMsg);
};

/** robustly extracts and repairs JSON from LLM output */
const extractAndParseJson = <T>(text: string, context: string): T | null => {
  let cleanText = text.trim();
  // Remove markdown code blocks if present
  const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) cleanText = match[1];

  try {
    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.log(e);
    try {
      // Attempt to repair broken JSON (unterminated strings, missing brackets)
      console.warn(`${context}: JSON parse failed, attempting repair...`);
      return JSON.parse(jsonrepair(cleanText)) as T;
    } catch (repairError) {
      console.error(`${context}: Critical JSON repair failed.`, repairError);
      return null;
    }
  }
};

/**
 * Parses a resume file (PDF/Text) into structured data using Gemini 2.5 Flash.
 * Returns the ParsedResumeData structure.
 */
export const parseCareerDocumentWithGemini = async (
  files: string[],
  currentProfile?: Partial<UserProfile>
): Promise<ParsedResumeData | undefined> => {
  try {
    console.log('Starting Universal Document Parsing...');

    // Prepare the context string with existing data
    const contextPrompt = currentProfile
      ? `\n\nCURRENT EXISTING PROFILE DATA:\n${JSON.stringify(currentProfile)}`
      : '\n\nCURRENT EXISTING PROFILE DATA: {} (New Profile)';

    const text = SYSTEM_UNIVERSAL_PARSER + contextPrompt;

    const part = await retrieveFilesAndGenerateContext(files, text);

    console.log('Generated context length:', part);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: part,
      },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1, // Low temperature for consistent data extraction
        maxOutputTokens: 8192,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            full_name: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            portfolio: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  school: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  year: { type: Type.STRING },
                },
              },
            },
            achievements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  date: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
            additional_info: { type: Type.STRING },
          },
        },
      },
    });

    if (!response.text) {
      throw new Error('No data returned from AI model.');
    }

    return (
      extractAndParseJson<ParsedResumeData>(
        response.text,
        'Universal Parsing'
      ) || undefined
    );
  } catch (error) {
    console.error('Gemini Parsing Error:', error);
    handleGeminiError(error, 'Document Analysis');
  }
};
/**
 * Interface for the full package output from Gemini, mirroring the fields we need to save.
 */
interface GeneratedApplicationOutput {
  tailored_cv_data: Omit<TailoredCV, 'id' | 'user_id' | 'created_at'>; // Structure for JSONB data
  cover_letter_markdown: string;
  qa_responses: QAResponse[]; // Still using the temp QAResponse structure
}

/**
 * Generates tailored application content (CV, CL, QA)
 */
export const generateApplicationPackage = async (
  profile: UserProfile,
  job: JobDescription,
  tone: WritingTone = 'professional'
): Promise<GeneratedApplicationOutput | undefined> => {
  try {
    console.log(`Starting Application Generation with tone: ${tone}`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: generateApplicationPrompt(profile, job, tone),
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 8192,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tailored_cv_data: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                skills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                    },
                  },
                },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      company: { type: Type.STRING },
                      role: { type: Type.STRING },
                      startDate: { type: Type.STRING },
                      endDate: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                  },
                },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      school: { type: Type.STRING },
                      degree: { type: Type.STRING },
                      year: { type: Type.STRING },
                    },
                  },
                },
                achievements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      date: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                  },
                },
              },
            },
            cover_letter_markdown: { type: Type.STRING },
            qa_responses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    if (!response.text) {
      console.warn(
        'Generate Application: Received empty text response from Gemini.'
      );
      throw new Error('No data returned from AI model.');
    } // Handle null return from the updated safe parser

    return (
      extractAndParseJson<GeneratedApplicationOutput>(
        response.text,
        'Application Generation'
      ) || undefined
    );
  } catch (error) {
    handleGeminiError(error, 'Application Generation');
  }
  return undefined;
};

/**
 * Chatbot for Q&A Simulation
 */
export const chatWithCareerCoach = async (
  history: Omit<Message, 'id' | 'chat_id' | 'user_id' | 'created_at'>[], // Using the new Message type structure
  profile: UserProfile,
  job: JobDescription
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      config: {
        systemInstruction: generateChatSystemInstruction(profile, job),
        maxOutputTokens: 1024,
      },
    });

    return (
      response.text || "I'm having trouble thinking of a response right now."
    );
  } catch (e) {
    console.error('Chat error:', e);
    return "I'm currently having trouble connecting to my brain. Please try again in a moment.";
  }
};

/**
 * Analyzes chat messages to extract new user details
 */
export const analyzeProfileUpdate = async (
  userMessage: string
): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: analyzeProfileUpdatePrompt(userMessage),
      config: { temperature: 0, maxOutputTokens: 200 },
    });

    const text = response.text?.trim();
    if (text === 'null' || text === 'NULL') return null;
    return text || null;
  } catch (e) {
    console.warn('Profile analysis silent fail:', e);
    return null;
  }
};
