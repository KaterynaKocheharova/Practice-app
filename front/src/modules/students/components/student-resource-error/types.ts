export interface StudentResourceErrorProps {
  error: unknown;
  loadFailedMessage: string;
  notFoundMessage: string;
  onRetry: () => void;
}
