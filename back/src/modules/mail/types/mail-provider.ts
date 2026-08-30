export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IMailProvider {
  sendEmail(options: SendEmailOptions): Promise<void>;
}
