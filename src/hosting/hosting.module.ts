import {Module} from '@nestjs/common';
import {SpacesModule} from '../spaces/spaces.module';
import {UsersModule} from '../users/users.module';
import {HostingConnectionResolver, HostingResolver} from './hosting.resolver';

@Module({
  imports: [SpacesModule, UsersModule],
  providers: [HostingResolver, HostingConnectionResolver],
})
export class HostingModule {}
