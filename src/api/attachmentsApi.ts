import { http } from './baseApi';

export async function presignUpload(key: string, contentType: string, ttlSeconds = 600) {
  const { data } = await http.post<{ url: string }>(`/attachments/presign`, {
    key, contentType, ttlSeconds,
  });
  return data.url;
}

export async function uploadToPresignedUrl(url: string, file: File) {
  const res = await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
  if (!res.ok) throw new Error('Upload failed');
}


