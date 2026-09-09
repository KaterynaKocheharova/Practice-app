import { verificationLinks } from '../../schemas/schema';

export const verificationLinkVerificationSelectFields = {
  userId: verificationLinks.userId,
  email: verificationLinks.email,
  purpose: verificationLinks.purpose,
  hashedToken: verificationLinks.hashedToken,
  expiresAt: verificationLinks.expiresAt,
  usedAt: verificationLinks.usedAt,
  revokedAt: verificationLinks.revokedAt,
};
