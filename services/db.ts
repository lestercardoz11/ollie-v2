import {
  UserProfile,
  JobDescription,
  GeneratedApplication,
  WorkExperience,
  Education,
  SupportingDocument,
  Achievement,
  SkillCategories,
} from '../lib/types';
import { createClient } from '@/utils/supabase/client';

// NOTE: This service now returns Promises for all operations due to network requests.

export const db = {
  /**
   * Profile Operations
   */
  saveProfile: async (profile: UserProfile): Promise<void> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const payload = {
      user_id: user.id,
      full_name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      summary: profile.summary,
      skills: profile.skills, // Now stores the JSON object directly
      experience: profile.experience,
      education: profile.education,
      achievements: profile.achievements,
      additional_info: profile.additionalInfo,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('candidate_profiles')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) throw error;
    window.dispatchEvent(new Event('db-update'));
  },

  getProfile: async (): Promise<UserProfile | null> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // 116 is no rows found
      console.error('Error fetching profile:', error);
      return null;
    }
    if (!data) return null;

    // Legacy migration: Check if skills is an array (old format) or object (new format)
    let parsedSkills: SkillCategories = {
      technical: [],
      soft: [],
      keywords: [],
    };

    if (Array.isArray(data.skills)) {
      // If it's the old string[], treat them all as technical/generic for now
      parsedSkills.technical = data.skills;
    } else if (data.skills) {
      // It's the new object structure
      parsedSkills = {
        technical: data.skills.technical || [],
        soft: data.skills.soft || [],
        keywords: data.skills.keywords || [],
      };
    }

    return {
      id: data.id,
      fullName: data.full_name || '',
      email: data.email || '',
      phone: data.phone || '',
      location: data.location || '',
      summary: data.summary || '',
      skills: parsedSkills,
      experience: (data.experience as WorkExperience[]) || [],
      education: (data.education as Education[]) || [],
      achievements: (data.achievements as Achievement[]) || [],
      additionalInfo: data.additional_info || '',
    };
  },

  /**
   * Document Operations
   */
  uploadDocument: async (file: File): Promise<SupportingDocument> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Upload to Supabase Storage
    // We use the user ID as a folder to isolate files
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('documents').getPublicUrl(fileName);

    // 3. Save Metadata to Table
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        name: file.name,
        file_url: publicUrl,
        file_type: file.type,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      fileUrl: data.file_url,
      fileType: data.file_type,
      createdAt: data.created_at,
    };
  },

  getDocuments: async (): Promise<SupportingDocument[]> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    return data.map(
      (d: {
        id: string;
        user_id: string;
        name: string;
        file_url: string;
        file_type: string;
        created_at: string;
      }) => ({
        id: d.id,
        userId: d.user_id,
        name: d.name,
        fileUrl: d.file_url,
        fileType: d.file_type,
        createdAt: d.created_at,
      })
    );
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    const supabase = createClient();
    // 1. Fetch document to get URL/path
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('file_url, user_id')
      .eq('id', documentId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Delete from Storage if possible
    if (doc && doc.file_url) {
      // Extract path from public URL.
      // URL structure usually: .../documents/USER_ID/FILENAME
      const bucketName = 'documents';
      const urlParts = doc.file_url.split(`/${bucketName}/`);
      if (urlParts.length > 1) {
        // The path relative to the bucket
        const storagePath = decodeURIComponent(urlParts[1]);
        await supabase.storage.from(bucketName).remove([storagePath]);
      }
    }

    // 3. Delete Record
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  },

  /**
   * Job Operations
   */
  saveJob: async (
    job: Omit<JobDescription, 'id' | 'createdAt'>
  ): Promise<string> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('job_descriptions')
      .insert({
        user_id: user.id,
        title: job.title,
        company: job.company,
        raw_text: job.rawText,
      })
      .select()
      .single();

    if (error) throw error;
    window.dispatchEvent(new Event('db-update'));
    return data.id;
  },

  getJobs: async (): Promise<JobDescription[]> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('job_descriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    return data.map(
      (j: {
        id: string;
        title: string;
        company: string;
        raw_text: string;
        created_at: string;
      }) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        rawText: j.raw_text,
        createdAt: j.created_at,
      })
    );
  },

  getJobById: async (id: string): Promise<JobDescription | undefined> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('job_descriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;

    return {
      id: data.id,
      title: data.title,
      company: data.company,
      rawText: data.raw_text,
      createdAt: data.created_at,
    };
  },

  /**
   * Application Operations
   */
  saveApplication: async (
    app: Omit<GeneratedApplication, 'id' | 'createdAt'>
  ): Promise<void> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if exists to update or insert
    const { data: existing } = await supabase
      .from('generated_outputs')
      .select('id')
      .eq('job_id', app.jobId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('generated_outputs')
        .update({
          tailored_cv: app.tailoredCv,
          cover_letter: app.coverLetter,
          qa_responses: app.qaResponses,
        })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('generated_outputs').insert({
        user_id: user.id,
        job_id: app.jobId,
        tailored_cv: app.tailoredCv,
        cover_letter: app.coverLetter,
        qa_responses: app.qaResponses,
      });
      if (error) throw error;
    }
    window.dispatchEvent(new Event('db-update'));
  },

  getApplications: async (): Promise<GeneratedApplication[]> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('generated_outputs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map(
      (a: {
        id: string;
        job_id: string;
        user_id: string;
        tailored_cv: string;
        cover_letter: string;
        qa_responses: { question: string; answer: string }[];
        created_at: string;
      }) => ({
        id: a.id,
        jobId: a.job_id,
        profileId: a.user_id, // mapping user_id to profileId for type compatibility
        tailoredCv: a.tailored_cv,
        coverLetter: a.cover_letter,
        qaResponses: a.qa_responses,
        createdAt: a.created_at,
      })
    );
  },

  getApplicationByJobId: async (
    jobId: string
  ): Promise<GeneratedApplication | undefined> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('generated_outputs')
      .select('*')
      .eq('job_id', jobId)
      .single();

    if (error || !data) return undefined;

    return {
      id: data.id,
      jobId: data.job_id,
      profileId: data.user_id,
      tailoredCv: data.tailored_cv,
      coverLetter: data.cover_letter,
      qaResponses: data.qa_responses,
      createdAt: data.created_at,
    };
  },
};
