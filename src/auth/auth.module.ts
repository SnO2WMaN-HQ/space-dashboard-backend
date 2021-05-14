import {Module} from '@nestjs/common';
import {ConfigModule, ConfigType} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {AuthConfig} from './auth.config';
import {JwtStrategy} from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(AuthConfig),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(AuthConfig)],
      inject: [AuthConfig.KEY],
      useFactory: async (config: ConfigType<typeof AuthConfig>) => ({
        secret: config.jwt.secret,
      }),
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
