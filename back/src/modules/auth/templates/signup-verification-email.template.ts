import { escapeHtml } from 'src/common/helpers';
import type { SendEmailOptions } from 'src/modules/mail';
import type { SignupVerificationEmailJobData } from '../types';

export const createSignupVerificationEmailTemplate = ({
  email,
  name,
  verificationLink,
}: SignupVerificationEmailJobData): SendEmailOptions => ({
  to: email,
  subject: 'Verify your email',
  html: `<p>Hello ${escapeHtml(name)},</p><p>Please verify your email by opening this link:</p><p><a href="${escapeHtml(verificationLink)}">Verify email</a></p>`,
  text: `Hello ${name}, please verify your email: ${verificationLink}`,
});
