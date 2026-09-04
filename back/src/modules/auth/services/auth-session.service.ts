import { randomUUID } from 'crypto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ERROR_CODE } from 'src/common/constants/errors/error-code.constant';
import { HASHING_SERVICE } from 'src/common/hashing/constants/hashing-service.token';
import type { IHashingService } from 'src/common/hashing/types/hashing-service.type';
import { AuthSessionsRepository } from '../repositories';
import type {
  AuthSessionUserData,
  AuthSessionTokensResult,
  RefreshTokenPayload,
  RefreshTokenSessionVerificationResult,
} from '../types';
import { AuthTokenService } from './auth-token.service';

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly authSessionsRepository: AuthSessionsRepository,
    private readonly authTokenService: AuthTokenService,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
  ) {}

  async createSessionTokens(
    user: AuthSessionUserData,
  ): Promise<AuthSessionTokensResult> {
    const sessionId = randomUUID();
    const tokens = await this.authTokenService.createTokens(user, sessionId);
    const hashedRefreshToken = await this.hashingService.hash(
      tokens.refreshToken,
    );

    await this.authSessionsRepository.createSession({
      id: sessionId,
      userId: user.id,
      hashedRefreshToken,
      expiresAt: tokens.refreshTokenExpiresAt,
    });

    return { sessionId, tokens };
  }

  async verifyRefreshTokenSession(
    refreshToken: string,
    payload: RefreshTokenPayload,
  ): Promise<RefreshTokenSessionVerificationResult> {
    const session =
      await this.authSessionsRepository.getSessionRefreshTokenDataById(
        payload.sessionId,
      );

    if (!session || session.expiresAt <= new Date()) {
      throw this.createInvalidRefreshTokenException();
    }

    if (session.userId !== payload.sub) {
      throw this.createInvalidRefreshTokenException();
    }

    if (session.revokedAt) {
      await this.revokeUserSessionsAfterRefreshTokenReuse(session.userId);
      throw this.createInvalidRefreshTokenException();
    }

    if (
      !(await this.hashingService.compare(
        refreshToken,
        session.hashedRefreshToken,
      ))
    ) {
      await this.revokeSessionsByUserId(session.userId);
      throw this.createInvalidRefreshTokenException();
    }

    return {
      payload,
      session: {
        id: payload.sessionId,
        userId: session.userId,
      },
    };
  }

  revokeSessionById(id: string, replacedBy?: string): Promise<void> {
    return this.authSessionsRepository.revokeSessionById(id, replacedBy);
  }

  revokeSessionsByUserId(userId: string): Promise<void> {
    return this.authSessionsRepository.revokeSessionsByUserId(userId);
  }

  private revokeUserSessionsAfterRefreshTokenReuse(
    userId: string,
  ): Promise<void> {
    return this.revokeSessionsByUserId(userId);
  }

  private createInvalidRefreshTokenException(): UnauthorizedException {
    return new UnauthorizedException({
      errorCode: ERROR_CODE.INVALID_REFRESH_TOKEN,
    });
  }
}
