export interface StudentPageProps {
  params: Promise<{
    studentId: string;
  }>;
  searchParams: Promise<{
    language?: string | string[];
  }>;
}
