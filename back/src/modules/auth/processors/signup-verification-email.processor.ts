import { Inject, Injectable } from '@nestjs/common';

import { mailConfig } from 'src/modules/mail';
import type { IMailProvider } from 'src/modules/mail';
import { createSignupVerificationEmailTemplate } from '../templates';
import type { SignupVerificationEmailJobData } from '../types';

@Injectable()
export class SignupVerificationEmailProcessor {
  constructor(
    @Inject(mailConfig.PROVIDER)
    private readonly mailProvider: IMailProvider,
  ) {}

  async process(data: SignupVerificationEmailJobData): Promise<void> {
    await this.mailProvider.sendEmail(
      createSignupVerificationEmailTemplate(data),
    );
  }
}
