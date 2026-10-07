/** Server-side request outcome; `status` is `null` when no response arrived. */
export type ServerApiResponse<TResponse> =
  { data: TResponse; ok: true } | { ok: false; status: number | null };
