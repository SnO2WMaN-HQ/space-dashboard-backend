import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {passportJwtSecret} from 'jwks-rsa';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AccountsService} from '../accounts/accounts.service';
import {AuthnConfig} from './auth.config';

@Injectable()
export class JwtAuthzStrategy extends PassportStrategy(Strategy, 'jwt-authz') {
  constructor(
    @Inject(AuthnConfig.KEY)
    private readonly config: ConfigType<typeof AuthnConfig>,
    private readonly accountsService: AccountsService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: config.jwksUri,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.audience,
      issuer: config.issuer,
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    return payload;
  }
}
