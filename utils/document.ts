// ------------------- Helper -------------------
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const handleDragOver = (
  e: React.DragEvent,
  setDragState: (v: boolean) => void
) => {
  e.preventDefault();
  e.stopPropagation();
  setDragState(true);
};

export const handleDragLeave = (
  e: React.DragEvent,
  setDragState: (v: boolean) => void
) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
  setDragState(false);
};
