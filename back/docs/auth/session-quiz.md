# Session Quiz

Short self-check answers; the full flows are in [session-endpoints.md](session-endpoints.md) and [google-oauth-flow.md](google-oauth-flow.md). Frontend-side answers are in `front/src/docs/architecture/api-requests-qa.md`.

**1. What happens when an already rotated refresh token is used again?**
Outside the grace window it is treated as theft and all of that user's sessions are revoked (`AuthSessionService.verifyRefreshTokenSession`). This catches theft whoever refreshes first: if the attacker refreshed first, the real user's later reuse also revokes the attacker's new session.

**2. Why does the 10-second refresh grace window give an attacker almost nothing?**
A stolen refresh token already lets the attacker get a fresh session before the real user refreshes. Inside the window `RefreshGraceService` only returns the successor tokens that were already issued, never a new session, and only for the exact token, the same user agent and a still-active successor; the only cost is that detection is skipped for those 10 seconds.

**3. What happens when two tabs refresh with the same token at once?**
The first request finds no Redis entry, rotates normally and stores the successor tokens for 10 seconds; the second finds the entry and gets the same pair, so both tabs end up with identical valid tokens. Without the window the second request would revoke all of that user's sessions.

**4. Why does the Google callback send a one-time code instead of the tokens in the redirect URL?**
URLs leak through browser history, server and proxy logs, the `Referer` header and copy-paste, and a leaked refresh token stays valid for days. The code is single-use (`GETDEL`), lives 60 seconds and only its hash is stored, so a leaked code is worthless; the tokens travel only server-to-server to `POST /auth/google/exchange`.

**5. What happens to the per-IP rate limit when all requests come through Vercel?**
The backend sees Vercel's shared server IPs, so all users share one bucket: 5 sign-ins a minute for everyone, one attacker can lock everyone out, and a `429` on refresh makes users look signed out. On Render `req.ip` is already the load balancer's address because `trust proxy` is not set; the planned fix is to forward the visitor's IP from Next with a shared secret and rate-limit by it.
