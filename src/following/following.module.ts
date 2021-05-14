import {Module} from '@nestjs/common';
import {PrismaModule} from '../prisma/prisma.module';
import {SpacesModule} from '../spaces/spaces.module';
import {UsersModule} from '../users/users.module';
import {
  FollowingConnectionResolver,
  FollowingResolver,
} from './following.resolver';
import {FollowingService} from './following.service';

@Module({
  imports: [SpacesModule, UsersModule, PrismaModule],
  providers: [FollowingService, FollowingResolver, FollowingConnectionResolver],
  exports: [FollowingService],
})
export class FollowingModule {}
