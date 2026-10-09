import { ApiError } from "./api-error";

const STORAGE_UPLOAD_METHOD = "PUT";

/**
 * Uploads a file straight to object storage with a presigned URL from the
 * backend. No cookies or auth refresh: the signature in the URL is the
 * permission, and it is bound to the file's content type and size.
 */
export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(uploadUrl, {
      body: file,
      headers: { "Content-Type": file.type },
      method: STORAGE_UPLOAD_METHOD,
    });
  } catch (error) {
    throw new ApiError("Storage upload failed.", 0, error);
  }

  if (!response.ok) {
    throw new ApiError(
      response.statusText || "Storage upload failed.",
      response.status,
      null,
    );
  }
}
