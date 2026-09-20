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

## Auth Request Flow

```mermaid
flowchart TD
  SignInPage[src/app/sign-in/page.tsx] --> SignInShell[AuthFormWrapper]
  SignInShell --> SignInForm[SignInForm]
  SignInForm --> SignInHook[useSignIn]
  SignInHook --> SignInApi[signIn]
  SignInApi --> ApiClient[apiJsonRequest]
  ApiClient --> SignInBackend[POST /auth/sign-in]
  SignInBackend --> SignInEmail[backend sends sign-in verification email]
  SignInForm --> SignInToast[toast Verification email sent]

  SignUpPage[src/app/sign-up/page.tsx] --> SignUpShell[AuthFormWrapper]
  SignUpShell --> SignUpForm[SignUpForm]
SignUpForm --> SignUpHook[useSignUp]
  SignUpHook --> SignUpApi[signUp]
  SignUpApi --> ApiClient
  ApiClient --> SignUpBackend[POST /auth/sign-up]
  SignUpBackend --> SignUpEmail[backend sends sign-up verification email]
  SignUpForm --> SignUpToast[toast Verification email sent]
```

Email verification page flow:

```mermaid
sequenceDiagram
  participant Browser
  participant Page as Verify page
  participant Status as SignIn/SignUpVerificationStatus
  participant Verification
  participant Hook as useVerifySignin/useVerifySignup
  participant Backend as Backend auth endpoint
  participant Me as GET /users/me

  Browser->>Page: Open /verify-signin?token=... or /verify-signup?token=...
  Page->>Status: Pass searchParams.token
  Status->>Verification: Pass verify mutation and messages
  Verification->>Hook: verify({ token })
  Hook->>Backend: POST /auth/verify-signin or /auth/verify-signup
  Backend-->>Browser: Set HttpOnly auth cookies
  Hook->>Me: Fetch current user
  Hook-->>Status: Update React Query cache and Zustand auth state
  Verification-->>Browser: toast success
  Verification-->>Browser: router.replace /home
  Verification-->>Browser: router.refresh
```

Logout order:

```mermaid
sequenceDiagram
  participant User
  participant Header
  participant Hook as useLogout
  participant Backend as POST /auth/logout
  participant Store as Zustand auth store
  participant Query as React Query cache
  participant Router as Next App Router
  participant Layout as RootLayout
  participant Me as GET /users/me

  User->>Header: Click Logout
  Header->>Header: show logout refresh loader
  Header->>Hook: logout()
  Hook->>Backend: POST /auth/logout
  Backend-->>Hook: Clears auth cookies
  Hook->>Store: clearAuth()
  Hook->>Query: remove current-user query
  Header->>Router: replace /sign-in
  Header->>Router: refresh()
  Router->>Layout: Re-render server layout
  Layout->>Me: getCurrentUserServer()
  Me-->>Layout: null
  Layout-->>Header: initialUser null
  Header->>Header: clear logout refresh loader
```

`Header` derives its authenticated structure from the server-provided `initialUser` prop. During logout it keeps auth actions in a loading state across both phases:

```text
logout pending
-> refresh pending while old initialUser is still present
-> router.refresh response arrives with initialUser null
-> loading clears and unauthenticated actions render
```

This prevents authenticated header actions from briefly reappearing after the logout request settles and before the refreshed root layout payload arrives. This is UI state only; protected-route decisions still depend on backend-owned HttpOnly cookies and server session lookup.

```mermaid
flowchart TD
  RootLayout[src/app/layout.tsx] --> ServerHelper[getCurrentUserServer]
  RootPage[src/app/page.tsx] --> ServerHelper
  ServerHelper --> Cookies[next/headers cookies]
  Cookies --> Backend[GET /users/me]
  Backend --> User[CurrentUser]
  Backend --> Guest[null]
  User --> Header[Header initialUser]
  RootPage --> RedirectHome[redirect to /home]
  Guest --> RedirectSignIn[redirect to /sign-in]
```

```mermaid
sequenceDiagram
  participant Browser
  participant RootPage as src/app/page.tsx
  participant Helper as getCurrentUserServer
  participant Backend as Backend /users/me

  Browser->>RootPage: GET /
  RootPage->>Helper: read current user
  Helper->>Backend: GET /users/me with Cookie header
  Backend-->>Helper: CurrentUser or unauthenticated
  alt CurrentUser
    RootPage-->>Browser: redirect /home
  else unauthenticated
    RootPage-->>Browser: redirect /sign-in
  end
```

Google OAuth flows:

```mermaid
sequenceDiagram
  participant Button as Google OAuth button
  participant Hook as useGoogleSignInOAuth/useGoogleSignUpOAuth
  participant Browser
  participant Backend as Backend OAuth endpoints
  participant Google
  participant Success as /auth/google/success
  participant Me as GET /users/me

  Button->>Hook: start OAuth
  Hook->>Browser: window.location.assign backend URL
  Browser->>Backend: GET /auth/google/sign-in or /auth/google/sign-up?role=...
  Backend-->>Browser: 302 Google authorization URL
  Browser->>Google: User selects account
  Google-->>Backend: GET /auth/google/callback
  Backend-->>Browser: Set auth cookies and 302 /auth/google/success
  Browser->>Success: Render GoogleOAuthSuccess
  Success->>Me: Load current user
  Success-->>Browser: router.replace /home
```


## Refresh Flow

The common API client handles refresh for ordinary API calls:

```text
apiRequest(path)
-> fetch backend endpoint with credentials: "include"
-> if fetch fails before an HTTP response, throw ApiError with status 0
-> if response is not 401, parse response or throw ApiError
-> if response is 401, call POST /auth/refresh once
-> retry the original request once
-> if refresh fails, throw ApiError to the caller
```

Refresh is guarded by a shared `refreshPromise`, so multiple simultaneous `401` responses reuse one refresh request instead of sending a burst of refresh calls.

Refresh does not run for `/auth/refresh` itself and can be disabled per request with `skipAuthRefresh`.

## Why Server Actions Are Not Used For Auth Requests

Next Server Actions are for server-side mutations initiated through the Next app. They are useful when Next owns the mutation, validation, cache revalidation, or cookie changes.

This auth flow is different:

- The backend already owns auth endpoints and cookie issuing.
- The browser must receive backend `Set-Cookie` headers directly.
- Auth hooks need TanStack Query mutation state and client-side cache updates.
- Google OAuth starts with browser navigation, not a server-side function call.
- Refresh is tied to failed API responses and retry behavior, so it belongs in the API client.