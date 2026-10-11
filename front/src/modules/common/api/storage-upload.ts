const STORAGE_UPLOAD_METHOD = "PUT";

/**
 * Uploads a file straight from the browser to object storage with a presigned
 * URL from the backend, so file bytes never pass through the Next server. No
 * cookies: the signature in the URL is the permission, bound to the file's
 * content type and size. Returns whether storage accepted the file.
 */
export const uploadToPresignedUrl = async (
  uploadUrl: string,
  file: File,
): Promise<boolean> => {
  try {
    const response = await fetch(uploadUrl, {
      body: file,
      headers: { "Content-Type": file.type },
      method: STORAGE_UPLOAD_METHOD,
    });

    return response.ok;
  } catch {
    return false;
  }
};
