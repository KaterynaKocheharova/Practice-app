export const sidebarStyles = {
  actions: "mt-auto border-t border-border p-4",
  brand: "text-base font-semibold text-foreground",
  closeButton: "h-10 w-10 px-0",
  closeIcon: "h-5 w-5",
  closed: "-translate-x-full",
  header: "flex h-16 items-center justify-between border-b border-border px-4",
  nav: "flex flex-col gap-1 p-4",
  open: "translate-x-0",
  overlay: {
    closed: "pointer-events-none opacity-0",
    open: "pointer-events-auto opacity-100",
    root: "fixed inset-0 z-50 bg-foreground/30 transition-opacity lg:hidden",
  },
  root: "fixed left-0 top-0 z-50 flex h-dvh w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-border bg-card shadow-bento transition-transform lg:hidden",
} as const;
