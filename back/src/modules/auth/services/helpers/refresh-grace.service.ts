import { createHash } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { HASHING_SERVICE } from 'src/common/hashing/constants/hashing-service.token';
import type { IHashingService } from 'src/common/hashing/types/hashing-service.type';
import { KEY_VALUE_STORE } from 'src/common/key-value-store';
import type { IKeyValueStore } from 'src/common/key-value-store';
import { authConfig } from '../../config';
import { AuthSessionsRepository } from '../../repositories';
import type {
  AuthTokens,
  RefreshGraceEntry,
  RefreshTokenPayload,
} from '../../types';

/**
 * Parallel requests (browser tabs, prefetches, server instances) can present
 * the same refresh token at once. For a short window after rotation the old
 * token gets the successor tokens that were already issued — never a new
 * session — instead of being treated as stolen.
 */
@Injectable()
export class RefreshGraceService {
  constructor(
    @Inject(KEY_VALUE_STORE) private readonly keyValueStore: IKeyValueStore,
    private readonly authSessionsRepository: AuthSessionsRepository,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
  ) {}

  async remember(
    rotatedSessionId: string,
    tokens: AuthTokens,
    userAgent: string | undefined,
  ): Promise<void> {
    const entry: RefreshGraceEntry = {
      userAgentHash: this.hashUserAgent(userAgent),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
    };

    await this.keyValueStore.set(
      this.createKey(rotatedSessionId),
      JSON.stringify(entry),
      authConfig.REFRESH_GRACE.TTL_MS,
    );
  }

  /** Successor tokens only for the exact rotated token, same client, live successor. */
  async findSuccessorTokens(
    refreshToken: string,
    payload: RefreshTokenPayload,
    userAgent: string | undefined,
  ): Promise<AuthTokens | undefined> {
    const rawEntry = await this.keyValueStore.get(
      this.createKey(payload.sessionId),
    );

    if (!rawEntry) {
      return undefined;
    }

    const entry = JSON.parse(rawEntry) as RefreshGraceEntry;

    if (entry.userAgentHash !== this.hashUserAgent(userAgent)) {
      return undefined;
    }

    const session =
      await this.authSessionsRepository.getSessionRefreshTokenDataById(
        payload.sessionId,
      );

    if (
      !session?.revokedAt ||
      !session.replacedBy ||
      session.userId !== payload.sub ||
      !(await this.hashingService.compare(
        refreshToken,
        session.hashedRefreshToken,
      )) ||
      !(await this.isSessionActive(session.replacedBy))
    ) {
      return undefined;
    }

    return {
      accessToken: entry.accessToken,
      refreshToken: entry.refreshToken,
      accessTokenExpiresAt: new Date(entry.accessTokenExpiresAt),
      refreshTokenExpiresAt: new Date(entry.refreshTokenExpiresAt),
    };
  }

  /** Logout or theft detection revokes the successor; the grace dies with it. */
  private async isSessionActive(sessionId: string): Promise<boolean> {
    const session =
      await this.authSessionsRepository.getSessionRefreshTokenDataById(
        sessionId,
      );

    return Boolean(
      session && !session.revokedAt && session.expiresAt > new Date(),
    );
  }

  private hashUserAgent(userAgent: string | undefined): string {
    return createHash('sha256')
      .update(userAgent ?? '')
      .digest('base64url');
  }

  private createKey(sessionId: string): string {
    return `${authConfig.REDIS_KEYS.REFRESH_GRACE}${sessionId}`;
  }
}
