import {registerAs} from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
}));
