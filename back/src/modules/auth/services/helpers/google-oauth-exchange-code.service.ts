import { createHash, randomBytes } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { KEY_VALUE_STORE } from 'src/common/key-value-store';
import type { IKeyValueStore } from 'src/common/key-value-store';
import { authConfig } from '../../config';

/**
 * One-time code handed to the frontend after the Google callback, so the
 * session cookies are set by the frontend's own domain. Only a hash is stored,
 * and reading it deletes it.
 */
@Injectable()
export class GoogleOAuthExchangeCodeService {
  constructor(
    @Inject(KEY_VALUE_STORE) private readonly keyValueStore: IKeyValueStore,
  ) {}

  async create(userId: string): Promise<string> {
    const code = randomBytes(32).toString('base64url');

    await this.keyValueStore.set(
      this.createKey(code),
      userId,
      authConfig.GOOGLE_OAUTH.EXCHANGE_CODE_TTL_MS,
    );

    return code;
  }

  async consume(code: string): Promise<string | undefined> {
    return this.keyValueStore.getDelete(this.createKey(code));
  }

  private createKey(code: string): string {
    const hashedCode = createHash('sha256').update(code).digest('base64url');

    return `${authConfig.REDIS_KEYS.GOOGLE_OAUTH_EXCHANGE_CODE}${hashedCode}`;
  }
}
