import { GoogleGenAI, Type } from '@google/genai';
import {
  SYSTEM_RESUME_PARSER,
  SYSTEM_SUPPORTING_DOC_PARSER,
  generateApplicationPrompt,
  generateChatSystemInstruction,
  analyzeProfileUpdatePrompt,
} from '../lib/prompts';
import { JobDescription, UserProfile, Message, TailoredCV } from '@/types/db';
import { ParsedResumeData, QAResponse, WritingTone } from '@/types/ai';

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

// Helper function to safely extract and parse JSON text block,
// returning the parsed object (T) on success or null on failure.
const extractAndParseJson = <T>(text: string, context: string): T | null => {
  let jsonText = text; // 1. Safe JSON block extraction (handles common markdown formats)
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
  } // 2. FIX: Sanitize the raw JSON text to handle unescaped control characters and newlines // that cause "Unterminated string" errors. This is crucial for LLM-generated JSON strings.

  const sanitizedJsonText = jsonText
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\n/g, '\\n'); // Escape unescaped newlines inside strings

  try {
    // Attempt to parse the cleaned text
    const parsedObject = JSON.parse(sanitizedJsonText); // Optional check
    if (typeof parsedObject !== 'object' || parsedObject === null) {
      console.error(
        `${context} JSON Error: Parsed result is not an object.`,
        parsedObject
      );
      console.log('Raw Response Text (Before Sanitization):', text);
      return null;
    }
    return parsedObject as T;
  } catch (jsonError) {
    // 3. Log error and return null (never throws)
    console.error(`${context} JSON Parse Failure:`, jsonError);
    console.log('Raw Response Text (Before Sanitization):', text);
    console.log('Sanitized JSON Text (Attempted to Parse):', sanitizedJsonText);
    return null;
  }
};

/**
 * Parses a resume file (PDF/Text) into structured data using Gemini 2.5 Flash.
 * Returns the ParsedResumeData structure.
 */
export const parseResumeWithGemini = async (
  base64Data: string,
  mimeType: string
): Promise<ParsedResumeData | undefined> => {
  try {
    console.log('Starting Resume Parsing...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: SYSTEM_RESUME_PARSER },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        temperature: 0,
        maxOutputTokens: 8192,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            full_name: { type: Type.STRING }, // Use snake_case for consistency
            summary: { type: Type.STRING },
            skills: {
              type: Type.OBJECT,
              properties: {
                technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                soft: { type: Type.ARRAY, items: { type: Type.STRING } },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
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
      },
    });

    if (!response.text) {
      console.warn('Parse Resume: Received empty text response from Gemini.');
      throw new Error('No data returned from AI model.');
    } // Handle null return from the updated safe parser

    return (
      extractAndParseJson<ParsedResumeData>(response.text, 'Resume Parsing') ||
      undefined
    );
  } catch (error) {
    handleGeminiError(error, 'Resume Parsing');
  }
};

/**
 * Parses a supporting document.
 * Returns a partial of the ParsedResumeData structure.
 */
export const parseSupportingDocWithGemini = async (
  base64Data: string,
  mimeType: string
): Promise<Partial<ParsedResumeData> | undefined> => {
  try {
    console.log('Starting Supporting Document Parsing...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: SYSTEM_SUPPORTING_DOC_PARSER },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        temperature: 0,
        maxOutputTokens: 4096,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: {
              type: Type.OBJECT,
              properties: {
                technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                soft: { type: Type.ARRAY, items: { type: Type.STRING } },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
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
          },
        },
      },
    });

    if (!response.text) {
      console.warn(
        'Parse Supporting Doc: Received empty text response from Gemini.'
      );
      throw new Error('No data returned from AI model.');
    } // Handle null return from the updated safe parser

    return (
      extractAndParseJson<Partial<ParsedResumeData>>(
        response.text,
        'Supporting Doc Parsing'
      ) || undefined
    );
  } catch (error) {
    handleGeminiError(error, 'Supporting Doc Parsing');
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
                skills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        enum: ['technical', 'soft', 'keywords'],
                      },
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
