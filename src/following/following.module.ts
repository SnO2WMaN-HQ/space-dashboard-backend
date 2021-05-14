import {Module} from '@nestjs/common';
import {SpacesModule} from '../spaces/spaces.module';
import {UsersModule} from '../users/users.module';
import {
  FollowingConnectionResolver,
  FollowingResolver,
} from './following.resolver';

@Module({
  imports: [SpacesModule, UsersModule],
  providers: [FollowingResolver, FollowingConnectionResolver],
})
export class FollowingModule {}
