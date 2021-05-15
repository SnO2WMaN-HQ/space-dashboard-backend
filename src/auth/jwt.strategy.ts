import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {passportJwtSecret} from 'jwks-rsa';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AccountsService} from '../accounts/accounts.service';
import {AuthConfig} from './auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly config: ConfigType<typeof AuthConfig>,
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

  validate(payload: {sub?: string}): Promise<{id: string} | null> {
    if (!payload?.sub) throw new BadRequestException();

    const [provider, id] = payload.sub.split('|');

    if (!provider || !id) throw new BadRequestException();

    switch (provider) {
      case 'twitter':
        return this.accountsService
          .ensureAccount({twitterId: id})
          .then(({user}) => user);
      default:
        throw new BadRequestException();
    }
  }
}
