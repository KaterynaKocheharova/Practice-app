export { mailConfig } from './config';
export { MailModule } from './mail.module';
export { MailProcessor } from './processors';
export { ResendMailProvider, SmtpMailProvider } from './providers';
export { MailQueueService } from './services';
export type {
  IMailProvider,
  SendEmailJobData,
  SendEmailOptions,
} from './types';
