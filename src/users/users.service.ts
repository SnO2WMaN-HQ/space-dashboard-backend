import {Injectable} from '@nestjs/common';
import {FollowingEntity} from '../following/following.entity';
import {HostingEntity} from '../hosting/hosting.entity';
import {PrismaService} from '../prisma/prisma.service';
import {UserEntity} from './user.entity';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findOne(
    where: {uniqueName: string} | {twitterId: string},
  ): Promise<UserEntity | null> {
    return this.prismaService.user.findUnique({
      where,
      select: {
        twitterId: true,
        uniqueName: true,
        displayName: true,
        picture: true,
        hostedSpaces: {select: {id: true}},
        followingSpaces: {select: {id: true}},
      },
    });
  }

  async all(): Promise<UserEntity[]> {
    return this.prismaService.user.findMany({
      select: {
        twitterId: true,
        uniqueName: true,
        displayName: true,
        picture: true,
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

  async spaceFollowing(
    twitterId: string,
    spaceId: string,
  ): Promise<boolean | null> {
    return this.prismaService.space
      .findUnique({
        where: {id: spaceId},
        select: {followingUsers: {select: {twitterId: true}}},
      })
      .then(
        (space) =>
          space &&
          space.followingUsers
            .map((user) => user.twitterId)
            .includes(twitterId),
      );
  }

  async ensureUser({
    twitterId,
    uniqueName,
    displayName,
    picture,
  }: {
    twitterId: string;
    uniqueName: string;
    displayName: string;
    picture: string;
  }): Promise<UserEntity> {
    return this.prismaService.user.upsert({
      where: {twitterId},
      create: {
        twitterId,
        uniqueName,
        displayName,
        picture,
      },
      update: {
        uniqueName,
        displayName,
        picture,
      },
      select: {
        twitterId: true,
        uniqueName: true,
        displayName: true,
        picture: true,
        hostedSpaces: {select: {id: true}},
        followingSpaces: {select: {id: true}},
      },
    });
  }
}
