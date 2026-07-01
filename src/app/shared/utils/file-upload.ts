export interface FileUploadConfig {
  maxSize: number; // bytes
  allowedTypes: string[]; // MIME types
  maxDimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Validate file upload
 * @param file - File to validate
 * @param config - Upload configuration
 * @returns Validation result with error message if invalid
 */
export function validateFileUpload(
  file: File,
  config: FileUploadConfig,
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Accepted types: ${config.allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Get file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., '2.5 MB')
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Create image preview from File
 * @param file - Image file
 * @returns Promise resolving to data URL
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string | null;
      if (result) {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions from File
 * @param file - Image file
 * @returns Promise resolving to dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}
