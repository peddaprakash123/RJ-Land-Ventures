import { v2 as cloudinary } from 'cloudinary';

/**
 * Server-side Cloudinary integration.
 *
 * The API secret must never be shipped to the browser, so all uploads go
 * through this Express server. The frontend sends a base64 data URI to
 * POST /api/uploads/image and receives back a permanent delivery URL.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim() || '';
const API_KEY = process.env.CLOUDINARY_API_KEY?.trim() || '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim() || '';
const FOLDER = process.env.CLOUDINARY_FOLDER?.trim() || 'rj-land-ventures/properties';

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
} else {
  console.warn(
    '[cloudinary] Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET. Image uploads are disabled.'
  );
}

/** Maximum decoded image size accepted from clients (8 MB). */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const DATA_URI_PATTERN =
  /^data:(image\/(?:png|jpe?g|webp|gif|avif|heic|heif));base64,([A-Za-z0-9+/=]+)$/;

export class UploadError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'UploadError';
    this.status = status;
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

/** Upload one property image encoded as a base64 data URI. */
export async function uploadPropertyImage(dataUri: unknown): Promise<UploadedImage> {
  if (!isCloudinaryConfigured) {
    throw new UploadError(
      'Image uploads are not configured on the server. Add the Cloudinary credentials to .env.',
      503
    );
  }

  if (typeof dataUri !== 'string' || dataUri.length === 0) {
    throw new UploadError('An image is required.');
  }

  const match = DATA_URI_PATTERN.exec(dataUri);
  if (!match) {
    throw new UploadError(
      'Unsupported image format. Use a PNG, JPG, WEBP, GIF, AVIF or HEIC image.'
    );
  }

  const [, mimeType, base64] = match;
  const decodedBytes = Buffer.byteLength(base64, 'base64');
  if (decodedBytes === 0) {
    throw new UploadError('The uploaded image is empty.');
  }
  if (decodedBytes > MAX_IMAGE_BYTES) {
    throw new UploadError(
      `The image is too large (${(decodedBytes / 1024 / 1024).toFixed(1)} MB). Maximum size is 8 MB.`
    );
  }

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: FOLDER,
      resource_type: 'image',
      timeout: 60_000,
    });

    return {
      // Store an already-optimised delivery URL (auto format + quality).
      url: cloudinary.url(result.public_id, {
        secure: true,
        fetch_format: 'auto',
        quality: 'auto',
      }),
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('[cloudinary] Upload failed:', {
      mimeType,
      bytes: decodedBytes,
      message: error instanceof Error ? error.message : error,
    });
    throw new UploadError(
      'Cloudinary could not store the image. Check the server credentials and try again.',
      502
    );
  }
}
