import { apiClient } from './api-client';
import type { UploadResponse } from '@/features/learn/types';

async function upload(type: 'image' | 'video' | 'document', file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  return apiClient.upload<UploadResponse>(`/uploads/${type}`, form);
}

export const uploadsService = {
  image: (file: File) => upload('image', file),
  video: (file: File) => upload('video', file),
  document: (file: File) => upload('document', file),
};
