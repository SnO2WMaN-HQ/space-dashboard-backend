import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {FollowingModule} from './following/following.module';
import {HostingModule} from './hosting/hosting.module';
import {PrismaModule} from './prisma/prisma.module';
import {SpacesModule} from './spaces/spaces.module';
import {UsersModule} from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      cors: false,
    }),
    PrismaModule,
    SpacesModule,
    UsersModule,
    HostingModule,
    FollowingModule,
  ],
})
export class AppModule {}
