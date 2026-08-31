import { Inject, Injectable } from '@nestjs/common';

import { MAIL_PROVIDER } from 'src/modules/mail';
import type { IMailProvider } from 'src/modules/mail';
import { createSigninVerificationEmailTemplate } from '../templates';
import type { SigninVerificationEmailJobData } from '../types';

@Injectable()
export class SigninVerificationEmailProcessor {
  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: IMailProvider,
  ) {}

  async process(data: SigninVerificationEmailJobData): Promise<void> {
    await this.mailProvider.sendEmail(
      createSigninVerificationEmailTemplate(data),
    );
  }
}
