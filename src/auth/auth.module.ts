import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PassportModule} from '@nestjs/passport';
import {AccountsModule} from '../accounts/accounts.module';
import {AuthnConfig} from './auth.config';
import {JwtAuthnStrategy} from './jwt-authn.strategy';
import {JwtAuthzStrategy} from './jwt-authz.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(AuthnConfig),
    PassportModule,
    AccountsModule,
  ],
  providers: [JwtAuthnStrategy, JwtAuthzStrategy],
})
export class AuthModule {}
