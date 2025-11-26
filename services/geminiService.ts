import { GoogleGenAI, Type } from '@google/genai';
import {
  SYSTEM_RESUME_PARSER,
  SYSTEM_SUPPORTING_DOC_PARSER,
  generateApplicationPrompt,
  generateChatSystemInstruction,
  analyzeProfileUpdatePrompt,
} from '../lib/prompts';
import {
  JobDescription,
  ParsedProfileData,
  QAResponse,
  UserProfile,
  WritingTone,
} from '@/lib/types';

// Initialize Client
const ai = new GoogleGenAI({
  apiKey:
    process.env.NEXT_GEMINI_API_KEY ||
    'AIzaSyBbWj6CctqdI85_VxAl5VxGzfAMB24KVB0',
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

/**
 * Parses a resume file (PDF/Text) into structured data using Gemini 2.5 Flash.
 */
export const parseResumeWithGemini = async (
  base64Data: string,
  mimeType: string
): Promise<ParsedProfileData | undefined> => {
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
            fullName: { type: Type.STRING },
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

    let text = response.text;
    if (!text) {
      console.warn('Parse Resume: Received empty text response from Gemini.');
      throw new Error('No data returned from AI model.');
    }

    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      return JSON.parse(text) as ParsedProfileData;
    } catch (jsonError) {
      console.error('Resume Parsing JSON Error:', jsonError);
      console.log('Raw Response Text:', text);
      throw new Error('Failed to parse JSON response from AI.');
    }
  } catch (error) {
    handleGeminiError(error, 'Resume Parsing');
  }
};

/**
 * Parses a supporting document.
 */
export const parseSupportingDocWithGemini = async (
  base64Data: string,
  mimeType: string
): Promise<Partial<ParsedProfileData | undefined>> => {
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

    let text = response.text;
    if (!text) {
      console.warn(
        'Parse Supporting Doc: Received empty text response from Gemini.'
      );
      throw new Error('No data returned from AI model.');
    }

    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      return JSON.parse(text) as Partial<ParsedProfileData>;
    } catch (jsonError) {
      console.error('Supporting Doc JSON Error:', jsonError);
      console.log('Raw Response Text:', text);
      throw new Error('Failed to parse JSON response from AI.');
    }
  } catch (error) {
    handleGeminiError(error, 'Supporting Doc Parsing');
  }
};

/**
 * Generates tailored application content (CV, CL, QA)
 */
export const generateApplicationPackage = async (
  profile: UserProfile,
  job: JobDescription,
  tone: WritingTone = 'professional'
): Promise<
  | {
      tailoredCv: string;
      coverLetter: string;
      qaResponses: QAResponse[];
    }
  | undefined
> => {
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
            tailoredCv: { type: Type.STRING },
            coverLetter: { type: Type.STRING },
            qaResponses: {
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

    let text = response.text;
    if (!text) {
      console.warn(
        'Generate Application: Received empty text response from Gemini.'
      );
      throw new Error('No data returned from AI model.');
    }

    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      return JSON.parse(text);
    } catch (jsonError) {
      console.error('Application Generation JSON Error:', jsonError);
      console.log('Raw Response Text:', text);
      throw new Error('Failed to parse JSON response from AI.');
    }
  } catch (error) {
    handleGeminiError(error, 'Application Generation');
  }
  return undefined; // Added return undefined for cases where handleGeminiError throws but the function signature expects a return.
};

/**
 * Chatbot for Q&A Simulation
 */
export const chatWithCareerCoach = async (
  history: { role: 'user' | 'assistant'; content: string }[],
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
