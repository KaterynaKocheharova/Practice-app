import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import { getAuthEnvConfig } from 'src/common/configs/env-config';
import type { GoogleOAuthState } from '../../types';

@Injectable()
export class GoogleOAuthStateEncoderService {
  constructor(private readonly configService: ConfigService) {}

  encode(state: GoogleOAuthState): string {
    const payload = Buffer.from(JSON.stringify(state), 'utf8').toString(
      'base64url',
    );
    const signature = this.sign(payload);

    return `${payload}.${signature}`;
  }

  private sign(payload: string): string {
    const { googleOAuthStateSecret } = getAuthEnvConfig(this.configService);

    return createHmac('sha256', googleOAuthStateSecret)
      .update(payload)
      .digest('base64url');
  }
}
