# API Requests

This frontend uses a small `fetch` wrapper, TanStack Query hooks, and in-memory Zustand state for API work.

## Layer Flow

```text
UI component
-> module hook
-> module API function
-> common API client
-> backend endpoint
```

## Direct Storage Uploads

File uploads skip the API client for the file itself: the backend returns a presigned URL and `uploadToPresignedUrl` (`common/api/storage-upload.ts`) sends the file there with a plain `PUT`, without cookies or the 401 refresh retry. A failed upload becomes an `ApiError` like any other request. See `course-documents.md`.
