import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AuthConfig} from './auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly config: ConfigType<typeof AuthConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  validate(payload: any) {
    return {id: payload.uid};
  }
}
