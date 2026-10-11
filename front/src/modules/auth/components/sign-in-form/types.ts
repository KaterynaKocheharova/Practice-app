export interface SignInFormProps {
  googleOAuthUrl: string | null;
  /** Set when the Google callback could not start a session. */
  hasGoogleOAuthError: boolean;
}
