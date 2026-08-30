import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import { getResendEnvConfig } from 'src/common/configs/env-config';
import type { IMailProvider, SendEmailOptions } from '../types';

@Injectable()
export class ResendMailProvider implements IMailProvider {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(configService: ConfigService) {
    const { apiKey, from } = getResendEnvConfig(configService);

    this.resend = new Resend(apiKey);
    this.from = from;
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      throw new Error(`Failed to send email with Resend: ${error.message}`);
    }
  }
}
