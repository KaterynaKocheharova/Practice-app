import { Injectable } from '@nestjs/common';
import type { GoogleOAuthState } from '../../types';
import { GoogleOAuthStateDecoderService } from './google-oauth-state-decoder.service';
import { GoogleOAuthStateEncoderService } from './google-oauth-state-encoder.service';

@Injectable()
export class GoogleOAuthStateService {
  constructor(
    private readonly decoder: GoogleOAuthStateDecoderService,
    private readonly encoder: GoogleOAuthStateEncoderService,
  ) {}

  encode(state: GoogleOAuthState): string {
    return this.encoder.encode(state);
  }

  decode(rawState: string): GoogleOAuthState | undefined {
    return this.decoder.decode(rawState);
  }
}
