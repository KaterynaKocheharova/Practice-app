export interface SignInPageProps {
  searchParams: Promise<{
    oauthError?: string | string[];
  }>;
}
