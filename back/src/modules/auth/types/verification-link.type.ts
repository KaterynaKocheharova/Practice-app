import { verificationLinks } from '../schemas/schema';

export type CreateVerificationLinkData = typeof verificationLinks.$inferInsert;
export type VerificationLinkData = typeof verificationLinks.$inferSelect;
export type VerificationLinkVerificationData = Pick<
  VerificationLinkData,
  | 'userId'
  | 'email'
  | 'purpose'
  | 'hashedToken'
  | 'expiresAt'
  | 'usedAt'
  | 'revokedAt'
>;
