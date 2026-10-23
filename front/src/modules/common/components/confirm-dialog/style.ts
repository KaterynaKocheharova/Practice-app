export const confirmDialogStyles = {
  actions: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  content: "flex flex-col gap-5",
  description: "text-sm text-muted-foreground",
  root: "m-auto w-[calc(100%-2rem)] max-w-md rounded-bento-sm border border-border bg-card p-6 text-foreground shadow-bento backdrop:bg-foreground/40",
  text: "flex flex-col gap-2",
  title: "text-lg font-semibold text-foreground",
} as const;
