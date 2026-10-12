/**
 * Escapes `LIKE`/`ILIKE` wildcards (`%`, `_`) and the escape character itself,
 * so user input is matched literally. Postgres uses `\` as the default escape.
 */
export const escapeLikePattern = (value: string): string =>
  value.replace(/[\\%_]/g, '\\$&');
