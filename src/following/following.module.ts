import {Module} from '@nestjs/common';
import {PrismaModule} from '../prisma/prisma.module';
import {SpacesModule} from '../spaces/spaces.module';
import {UsersModule} from '../users/users.module';
import {FollowingResolver} from './following.resolver';
import {FollowingService} from './following.service';

@Module({
  imports: [SpacesModule, UsersModule, PrismaModule],
  providers: [FollowingService, FollowingResolver],
  exports: [FollowingService],
})
export class FollowingModule {}
