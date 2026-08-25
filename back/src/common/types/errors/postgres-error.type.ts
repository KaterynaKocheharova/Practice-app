export interface PostgresError {
  code: string;
  severity?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  message?: string;
}
