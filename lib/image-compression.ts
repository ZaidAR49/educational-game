import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file and converts it to WebP format.
 * Intended for organization logos, restricting size to 500KB and dimensions to 500x500.
 *
 * @param file - The raw Image File object from the file input.
 * @returns A Promise that resolves to the compressed File object in WebP format.
 */
export async function compressLogoImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5, // 500KB
    maxWidthOrHeight: 500, // 500px width/height
    useWebWorker: true,
    fileType: 'image/webp', // strictly output WebP
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}
