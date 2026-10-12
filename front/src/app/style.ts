export const rootLayoutStyles = {
  body: "min-h-full flex flex-col",
  htmlTheme: "day h-full antialiased",
} as const;

export const routeStatusStyles = {
  actions: "flex justify-center",
  details:
    "max-w-xl rounded-[var(--input-radius)] border border-border bg-card px-4 py-3 text-sm leading-6 text-muted-foreground",
  detailsLabel: "mb-1 block font-medium text-foreground",
  description: "max-w-xl text-base leading-7 text-muted-foreground",
  loader: "h-12 w-12 rounded-full",
  panel:
    "mx-auto flex min-h-[calc(100vh-9rem)] max-w-2xl flex-col items-center justify-center gap-6 text-center",
  title: "text-3xl font-semibold text-foreground sm:text-4xl",
} as const;
