import type { Property } from '../data/chennaiProperties';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');
const API_KEY = (import.meta.env.VITE_API_KEY || '').trim();

const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['x-api-key'] = API_KEY;
  return headers;
};

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as { error?: string };
    if (body?.error) return body.error;
  } catch {
    // Response was not JSON; fall through to the generic message.
  }
  return `API request failed (${response.status} ${response.statusText}).`;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: init?.signal ?? controller.signal,
      headers: {
        ...buildHeaders(),
        ...(init?.headers as Record<string, string> | undefined),
      },
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your network connection.');
    }
    if (error instanceof TypeError) {
      throw new Error('Failed to fetch. Please check your network connection.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/** Keep in sync with MAX_IMAGE_BYTES in server/cloudinary.ts. */
export const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024;

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Could not read "${file.name}".`));
    reader.readAsDataURL(file);
  });

/**
 * Upload a listing photo through the API (which forwards it to Cloudinary).
 * Returns a permanent, optimised URL that can be stored with the property.
 */
export const uploadPropertyImage = async (file: File): Promise<UploadedImage> => {
  if (!file.type.startsWith('image/')) {
    throw new Error(`"${file.name}" is not an image file.`);
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error(`"${file.name}" is larger than 8 MB.`);
  }

  const dataUrl = await readFileAsDataUrl(file);
  return request<UploadedImage>('/uploads/image', {
    method: 'POST',
    body: JSON.stringify({ file: dataUrl }),
  });
};

export const fetchProperties = (): Promise<Property[]> =>
  request<Property[]>('/properties');

export const createProperty = (property: Property): Promise<Property> =>
  request<Property>('/properties', {
    method: 'POST',
    body: JSON.stringify(property),
  });

export const updateProperty = (property: Property): Promise<Property> =>
  request<Property>(`/properties/${encodeURIComponent(property.id)}`, {
    method: 'PUT',
    body: JSON.stringify(property),
  });

export const deleteProperty = (id: string): Promise<{ ok: boolean }> =>
  request<{ ok: boolean }>(`/properties/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

export const checkApiHealth = (): Promise<{ ok: boolean }> =>
  request<{ ok: boolean }>('/health');
