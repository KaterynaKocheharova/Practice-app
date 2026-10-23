export interface GoalsPageProps {
  searchParams: Promise<{
    status?: string | string[];
  }>;
}
