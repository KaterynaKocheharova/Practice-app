import { Injectable } from '@nestjs/common';
import type { GoogleOAuthState } from '../../types';

@Injectable()
export class GoogleOAuthStateEncoderService {
  encode(state: GoogleOAuthState): string {
    return Buffer.from(JSON.stringify(state), 'utf8').toString('base64url');
  }
}
