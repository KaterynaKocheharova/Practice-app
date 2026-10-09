import { COURSE_DOCUMENTS_SWAGGER } from './course-documents.swagger';

const { ACCESS_DESCRIPTION, COURSE_NOT_FOUND_DESCRIPTION } =
  COURSE_DOCUMENTS_SWAGGER;

export const CREATE_COURSE_DOCUMENT_UPLOAD_URL_SWAGGER = {
  SUMMARY: 'Request a course document upload URL',
  DESCRIPTION: `Step 1 of a file upload. Validates the file type and its size limit (documents 20 MB, images 10 MB, audio 50 MB) and returns a presigned URL valid for 5 minutes. The client then sends the file with \`PUT\` to \`uploadUrl\`, using exactly the declared \`Content-Type\` and size, and finishes with \`POST .../documents/files\`. Uploads never attached are deleted after 24 hours. ${ACCESS_DESCRIPTION}`,
  REQUEST_BODY_DESCRIPTION: 'Name, content type and exact size of the file.',
  CREATED_RESPONSE_DESCRIPTION:
    'Upload URL issued. `mediaAssetId` is sent back in step 2.',
  CREATED_RESPONSE_EXAMPLE: {
    mediaAssetId: '7d6c5b4a-3f2e-4d1c-8b0a-9f8e7d6c5b4a',
    uploadUrl:
      'https://storage.example.com/app-documents/uploads/0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b/1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=300&X-Amz-SignedHeaders=content-length%3Bcontent-type%3Bhost&X-Amz-Signature=...',
  },
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Returned when an id is not a valid UUID, the content type is not supported, or the size exceeds the limit for its type.',
  NOT_FOUND_RESPONSE_DESCRIPTION: `Returned when ${COURSE_NOT_FOUND_DESCRIPTION}.`,
} as const;
