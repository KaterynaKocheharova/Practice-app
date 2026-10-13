# API Requests

The browser never calls the backend. In production the frontend (Vercel) and the backend (Render) are on different sites, so backend cookies could not reach the Next server and cross-site `fetch` would not send `sameSite: lax` cookies. Every request goes browser → Next → backend ("backend for frontend"), and the session cookies live on this app's domain.

## Layer Flow

```text
Reads:   Server Component -> modules/<name>/api/*-server.ts -> serverApiRequest -> backend
Writes:  Client component -> useServerAction -> "use server" action -> serverApiRequest -> backend
                                                 └─ refresh() on success -> page re-renders with fresh data
```

- `serverApiRequest` (`common/api/server-api-request.ts`, `server-only`) forwards the request cookies, never throws and returns `ServerApiResponse`: `{ ok: true, data }` or `{ ok: false, status, errorCode }`. Backend error text stays on the server; components map `errorCode` to `ERRORS`.
- `useServerAction` (`common/hooks`) runs an action in a transition (`isPending` covers the action and the refresh it triggers) and turns a network failure into a failed result.
- Failed reads render `RefreshButton` (router refresh) for a retry; 404/400 render a not-found message.
- The backend URL is the server-only `API_URL`.

## Session Refresh (proxy)

`src/proxy.ts` is the only place that refreshes. It runs before every page render and server function call.

```mermaid
sequenceDiagram
  participant B as Browser
  participant P as proxy.ts
  participant R as Page / server action
  participant BE as Backend
  B->>P: request (cookies: accessToken?, refreshToken)
  alt access token missing or expiring within 30 s
    P->>BE: POST /auth/refresh (refresh cookie + browser user agent)
    BE-->>P: Set-Cookie: new access + refresh token
    P->>R: request with the new cookies
    R->>BE: API call with the new access token
    P-->>B: response + Set-Cookie (this domain)
  else token still valid
    P->>R: request unchanged
  end
```

- Refresh rejected (401): both cookies are deleted, the page renders signed out.
- Backend unreachable: cookies are kept, the page fails soft.
- Parallel requests can refresh with the same token at once (tabs, prefetches, server instances). The backend's 10-second grace window returns the already-issued successor tokens to the same browser instead of treating the reuse as theft.

## Session Cookies on This Domain

Server functions and route handlers that receive session cookies pass `forwardSetCookies: true`: the backend's `Set-Cookie` values are re-set with this app's attributes (`httpOnly`, `sameSite: lax`, `secure` in production, path `/`). Used by sign-in/sign-up verification and the Google code exchange. Logout deletes both cookies locally whatever the backend answers.

## Google OAuth

```mermaid
sequenceDiagram
  participant B as Browser
  participant N as Next
  participant BE as Backend
  participant G as Google
  B->>BE: GET /auth/google/sign-in (URL built on the server)
  BE-->>B: redirect to Google + state cookie (backend domain)
  B->>G: consent
  G-->>B: redirect to backend callback
  B->>BE: GET /auth/google/callback
  BE-->>B: redirect /auth/google/callback?code=<one-time code>
  B->>N: GET /auth/google/callback?code=...
  N->>BE: POST /auth/google/exchange { code }
  BE-->>N: Set-Cookie: session
  N-->>B: redirect / (cookies on this domain)
```

The code is single-use, valid for 60 seconds, and only its hash is stored. A missing or rejected code redirects to `/sign-in?oauthError=1`, which shows a generic error.

## Direct Storage Uploads

File bytes skip the Next server: an action gets a presigned URL, the browser `PUT`s the file straight to storage with `uploadToPresignedUrl` (`common/api/storage-upload.ts`, no cookies), and a second action creates the document. See `course-documents.md`.

Self-check questions: [api-requests-qa.md](api-requests-qa.md).
