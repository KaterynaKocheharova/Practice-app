import { escapeHtml } from 'src/common/helpers';
import type { SendEmailOptions } from 'src/modules/mail';
import type { SigninVerificationEmailJobData } from '../types';

export const createSigninVerificationEmailTemplate = ({
  email,
  name,
  verificationLink,
}: SigninVerificationEmailJobData): SendEmailOptions => ({
  to: email,
  subject: 'Verify your sign-in',
  html: `<p>Hello ${escapeHtml(name)},</p><p>Please verify your sign-in by opening this link:</p><p><a href="${escapeHtml(verificationLink)}">Verify sign-in</a></p>`,
  text: `Hello ${name}, please verify your sign-in: ${verificationLink}`,
});
