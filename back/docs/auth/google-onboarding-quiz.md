# Google Sign-In and Onboarding Quiz

Short self-check answers; the full flow is in [google-oauth-flow.md](google-oauth-flow.md).

**1. Why does `JwtAccessGuard` answer an onboarding user with 403 `ONBOARDING_REQUIRED` instead of 401?**
The user is authenticated but not yet allowed on that route, which is what 403 means. A 401 would make the frontend refresh and retry forever, because the refresh succeeds; the 403 code tells it to send the user to the onboarding page instead.

**2. What attack does the OAuth `state` checked against the nonce cookie prevent?**
Login CSRF: an attacker sends the victim a callback link with the attacker's own Google `code`, so the victim is logged into the attacker's account and enters their own data there. The victim's browser sends its own nonce cookie (or none), which does not match the `state` in the link, so `isStateValid` rejects it with `INVALID_GOOGLE_OAUTH_STATE`; the comparison uses `timingSafeEqual`.

**3. What is the whole Google sign-in flow?**
`GET /auth/google` sets a random nonce cookie and redirects to Google with the nonce as `state`; Google redirects to the backend callback, which checks the state, swaps the code for an ID token, verifies it, requires a verified email and finds, links or creates the user (new users get `status = onboarding`). The backend then redirects to the Next.js callback route with its own one-time code, and that route calls `POST /auth/google/exchange`, which creates the session and returns the cookies that Next.js sets in the browser.

**4. What happens in `findOrCreateGoogleUser` when no user has the Google ID but a user with the same email exists?**
`linkGoogleProfile` stores the Google ID, avatar and `status = active` on that user, unless the user already has a different Google ID (409 `GOOGLE_ACCOUNT_CONFLICT`) or is a `managed` student (409 `USER_WITH_EMAIL_ALREADY_EXISTS`). Linking by email is safe only because unverified Google emails are rejected earlier with `GOOGLE_EMAIL_NOT_VERIFIED`.

**5. Why does a repeated Google login update only the avatar and not the name?**
The Google name only pre-fills the onboarding form; after onboarding the name belongs to the user, and copying the Google name on every login would overwrite what they typed. `avatarUrl ?? null` keeps the update non-empty, because Drizzle throws on an empty `set`.

**6. Why doesn't the backend callback set the auth cookies itself?**
A response can only set cookies for its own domain, and the callback response comes from the backend, while the frontend runs on a different domain and needs the cookies there. The backend therefore redirects to the Next.js callback route with a short-lived, single-use code (safe in a URL, unlike tokens), and Next.js exchanges it server-to-server and sets the cookies on its own domain.
