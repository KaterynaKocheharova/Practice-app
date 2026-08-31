import { Inject, Injectable } from '@nestjs/common';

import { MAIL_PROVIDER } from 'src/modules/mail';
import type { IMailProvider } from 'src/modules/mail';
import { createSignupVerificationEmailTemplate } from '../templates';
import type { SignupVerificationEmailJobData } from '../types';

@Injectable()
export class SignupVerificationEmailProcessor {
  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: IMailProvider,
  ) {}

  async process(data: SignupVerificationEmailJobData): Promise<void> {
    await this.mailProvider.sendEmail(
      createSignupVerificationEmailTemplate(data),
    );
  }
}
