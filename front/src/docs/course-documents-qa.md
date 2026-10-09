# Course Documents Q&A

**1. Why does the open button create a blank tab before asking for the file URL?**
Browsers allow `window.open()` only during the user's click. `useOpenCourseDocument` opens `about:blank` synchronously in the click, sets `opener = null`, requests the URL, then sets `tab.location.href`. If the request fails it closes the tab; if pop-ups are blocked it shows `OPEN_FAILED`.

**2. Why not send presigned URLs with the course details and use plain links?**
Possible, and simpler on the frontend. But URLs expire after 5 minutes, so links on a page left open would return `403` unless the course is refetched or URLs live much longer. A presigned URL works for anyone holding it, and creating one per file on every page load spreads working URLs into responses, the query cache and history. Creating it on click keeps each URL fresh and short-lived.
