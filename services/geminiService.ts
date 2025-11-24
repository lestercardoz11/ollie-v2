import { ParsedProfileData, UserProfile, JobDescription, WritingTone } from "../types";

/**
 * Helper for API calls
 */
async function postToApi(endpoint: string, body: any) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'API Request Failed');
  }
  return res.json();
}

export const parseResumeWithGemini = async (
  base64Data: string,
  mimeType: string
): Promise<ParsedProfileData> => {
  return postToApi('/api/ai/resume', { base64Data, mimeType });
};

export const parseSupportingDocWithGemini = async (
  base64Data: string,
  mimeType: string
): Promise<Partial<ParsedProfileData>> => {
  return postToApi('/api/ai/doc', { base64Data, mimeType });
};

export const generateApplicationPackage = async (
  profile: UserProfile,
  job: JobDescription,
  tone: WritingTone = 'professional'
): Promise<{ tailoredCv: string; coverLetter: string; qaResponses: any[] }> => {
  return postToApi('/api/ai/generate', { profile, job, tone });
};

export const chatWithCareerCoach = async (
    history: { role: 'user' | 'assistant', content: string }[],
    profile: UserProfile,
    job: JobDescription
): Promise<string> => {
  const data = await postToApi('/api/ai/chat', { history, profile, job, mode: 'chat' });
  return data.result;
};

export const analyzeProfileUpdate = async (
    userMessage: string
): Promise<string | null> => {
    try {
        const data = await postToApi('/api/ai/chat', { userMessage, mode: 'analyze' });
        const text = data.result;
        if (text === 'null' || text === 'NULL') return null;
        return text || null;
    } catch (e) {
        return null;
    }
};