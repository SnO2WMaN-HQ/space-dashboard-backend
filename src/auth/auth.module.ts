import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PassportModule} from '@nestjs/passport';
import {AccountsModule} from '../accounts/accounts.module';
import {AuthConfig} from './auth.config';
import {JwtStrategy} from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(AuthConfig),
    PassportModule,
    AccountsModule,
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
