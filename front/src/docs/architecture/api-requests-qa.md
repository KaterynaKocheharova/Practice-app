# API Requests Q&A

Short self-check answers; the full flows are in [api-requests.md](api-requests.md). Backend-side answers (rotation, grace window, Google code, rate limits) are in `back/docs/auth/session-quiz.md`.

**1. Why can't the browser call the backend directly once the apps are on Vercel and Render?**
The backend's cookies are host-only for the Render domain and `sameSite: lax`, so a `fetch` from the Vercel page is cross-site and the browser does not send them. Even if it did, cookies stored under the Render domain never reach the Next server, so every server-rendered page and `requireRoleServer` would see a signed-out user.

**2. Why is the Google code exchanged in a route handler (`auth/google/callback/route.ts`) and not while rendering a page?**
Cookies are set with `Set-Cookie` response headers, and a Server Component renders while the response is already streaming, so its headers are gone. Cookies can be set only in server functions, route handlers and the proxy; the exchange uses `forwardSetCookies: true`.

**3. Does React `cache()` around `getCurrentUserServer` share the user between requests or users?**
No, the cache lives for one server request and is discarded afterwards, so two page loads make two `/users/me` calls even for the same user. It deduplicates calls inside one request: the layout and `requireRoleServer` share one call, which matters because a layout cannot pass props to its page.

**4. What does "fail soft" mean when the proxy's refresh is `Unavailable`?**
The proxy keeps the cookies and lets the request through instead of throwing or signing the user out. Backend calls in that render then fail quietly: the header shows signed out, `requireRoleServer` redirects to sign-in, data blocks show a retry; the next request after the backend recovers refreshes normally.

**5. Why does the proxy set refreshed cookies on both the request and the response?**
The page reads cookies from the incoming request, so `request.cookies.set` lets the current render use the new access token. `response.cookies.set` sends `Set-Cookie` to the browser so later requests have them; without it the browser would resend the rotated refresh token.

**6. Which cache does `refresh()` in the course document actions clear?**
None on the server: backend fetches are `no-store` and there is no client store. `refresh()` makes the action's response carry a freshly server-rendered current page, so the course page shows the new document list.

**7. Why do teacher pages call a read helper before `requireRoleServer` without awaiting it?**
To start the data request together with `/users/me` instead of after it. The child Server Component later calls the same `cache()`-wrapped helper and gets the in-flight request, so there is still one HTTP call. The backend authorizes the read, so starting it before the frontend guard leaks nothing.
