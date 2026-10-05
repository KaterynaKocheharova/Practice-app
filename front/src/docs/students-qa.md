# Students Q&A

**1. A student opens `/students/new`. Where do they end up?**
`/courses`. `requireRoleServer(Teacher)` redirects to `roleHomeRoutes[user.role]`.

**2. Why is the guard in each `page.tsx`, not in a layout?**
Layouts don't re-render on client navigation and don't stop child pages from rendering.

**3. 23 students, "Load more" clicked twice: which offsets are sent? Why no third button?**
`0`, `10`, `20`. When loaded (23) equals `total`, `hasNextPage` is `false` and the button is not rendered. It is disabled only while a page is loading.

**4. Only the name is filled in. What body is sent?**
`{ name }`. Empty strings are omitted because the backend rejects `""` (`@IsOptional` only skips `undefined`/`null`).

**5. Why does invalidating `["students"]` reach `["students", "list", 10]`?**
Query keys match by prefix. The list is marked stale and refetches, all loaded pages from the first, when `/students` mounts.

**6. Why `ButtonLink`, not `Button` + `router.push`?**
A real `<a href>`: announced as a link, opens in a new tab, prefetched, and works in a Server Component without JavaScript.

## Follow-ups

**Can a Server Action set cookies?**
Yes, but only when the browser calls it, not while a Server Component is rendering.

**Can `proxy.ts` call a Server Action to refresh?**
No need: the proxy sets cookies itself on `NextResponse`.

**So can tokens be refreshed on the server?**
Yes, in `proxy.ts`. It requires Next and the backend on the same host in production, and simultaneous refreshes must not revoke each other's refresh token.
