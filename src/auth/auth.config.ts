import {registerAs} from '@nestjs/config';
import {URL} from 'url';

export const AuthConfig = registerAs('auth', () => ({
  audience: process.env.AUTH0_AUDIENCE!,
  issuer: process.env.AUTH0_ISSUER_URL!,
  jwksUri: new URL(
    '/.well-known/jwks.json',
    process.env.AUTH0_ISSUER_URL!,
  ).toString(),
}));
