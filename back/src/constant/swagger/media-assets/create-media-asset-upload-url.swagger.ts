export const CREATE_MEDIA_ASSET_UPLOAD_URL_SWAGGER = {
  BODY: {
    FILE_NAME: {
      EXAMPLE: 'homework.pdf',
      DESCRIPTION:
        'Original file name; used as the download name and default title.',
    },
    MIME_TYPE: {
      EXAMPLE: 'application/pdf',
      DESCRIPTION:
        'Content type of the file. The upload must send exactly this `Content-Type`.',
    },
    SIZE_BYTES: {
      EXAMPLE: 2_048_000,
      DESCRIPTION:
        'Exact file size in bytes. Limits: documents 20 MB, images 10 MB, audio 50 MB.',
    },
  },
} as const;
