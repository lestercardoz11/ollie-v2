import { Part } from '@google/genai';
import { createClient } from '@/utils/supabase/client';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const retrieveFilesAndGenerateContext = async (
  files: string[],
  userPrompt: string
): Promise<Part[]> => {
  const supabase = createClient();
  const bucketName = 'documents';

  if (files.length === 0) {
    return [{ text: userPrompt }];
  }

  // Enforce a limit of 5 files to prevent overly large requests
  const filesToProcess = files.slice(0, 5);

  try {
    // 1. Concurrent Retrieval of all files from Supabase Storage
    const downloadPromises = filesToProcess.map((file) =>
      supabase.storage.from(bucketName).download(file)
    );

    const downloadResults = await Promise.all(downloadPromises);

    const contents: Part[] = [];

    for (let i = 0; i < downloadResults.length; i++) {
      const { data: fileData, error: downloadError } = downloadResults[i];
      const filePath = filesToProcess[i];

      if (downloadError) {
        console.error(
          `Supabase Storage Download Error for ${filePath}:`,
          downloadError
        );
        // We will skip this file but continue processing others
        continue;
      }

      if (!fileData) {
        console.warn(`File data is null or empty for ${filePath}. Skipping.`);
        continue;
      }

      // Determine MIME type (use the built-in Blob type)
      const mimeType = fileData.type;
      console.log(`File retrieved: ${filePath}. MIME Type: ${mimeType}`);

      // 2. Convert Blob to ArrayBuffer, then to Base64
      const arrayBuffer = await fileData.arrayBuffer();
      const base64Data = arrayBufferToBase64(arrayBuffer);

      // 3. Construct the inlineData part for Gemini
      contents.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      });
    }

    // 4. Add the final user text prompt after all files
    contents.push({ text: userPrompt });

    return contents;
  } catch (error) {
    console.error('Error in retrieveFilesAndGenerateContext:', error);
    // Re-throw the error to be handled by the calling function
    throw error;
  }
};

export const getDocumentLink = (fileUrl: string): string => {
  const supabase = createClient();
  const bucketName = 'documents';
  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileUrl);
  return data.publicUrl;
};
