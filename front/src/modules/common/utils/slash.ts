export function trimLeadingSlash(value: string): string {
  return value.replace(/^\/+/, "");
}

export function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}
