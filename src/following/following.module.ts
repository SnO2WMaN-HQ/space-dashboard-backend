import {Module} from '@nestjs/common';
import {SpacesModule} from '../spaces/spaces.module';
import {UsersModule} from '../users/users.module';
import {FollowingResolver} from './following.resolver';

@Module({
  imports: [SpacesModule, UsersModule],
  providers: [FollowingResolver],
})
export class FollowingModule {}
