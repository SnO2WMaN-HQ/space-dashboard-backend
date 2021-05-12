import {Injectable} from '@nestjs/common';
import {FollowingEntity} from '../following/following.entity';
import {HostingEntity} from '../hosting/hosting.entity';
import {PrismaService} from '../prisma/prisma.service';
import {UserEntity} from './user.entity';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findByTwitterId(twitterId: string): Promise<UserEntity | null> {
    return this.prismaService.user.findUnique({
      where: {twitterId},
      select: {
        twitterId: true,
        hostedSpaces: {select: {id: true}},
        followingSpaces: {select: {id: true}},
      },
    });
  }

  async all() {
    return this.prismaService.user.findMany({
      select: {
        twitterId: true,
        hostedSpaces: {select: {id: true}},
        followingSpaces: {select: {id: true}},
      },
    });
  }

  resolveHostedSpaces({twitterId, hostedSpaces}: UserEntity): HostingEntity[] {
    return hostedSpaces.map(({id: spaceId}) => ({
      userTwitterId: twitterId,
      spaceId,
    }));
  }

  resolveFollowingSpaces({
    twitterId,
    followingSpaces,
  }: UserEntity): FollowingEntity[] {
    return followingSpaces.map(({id: spaceId}) => ({
      userTwitterId: twitterId,
      spaceId,
    }));
  }
}
