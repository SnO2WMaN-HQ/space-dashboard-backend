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
      },
    });
  }

  resolveHostedSpaces(
    twitterId: string,
    {finished}: {finished: boolean},
  ): Promise<HostingEntity[] | null> {
    return this.prismaService.user
      .findUnique({
        where: {twitterId},
        select: {
          followingSpaces: {
            where: {finished},
            select: {id: true},
          },
        },
      })
      .then(
        (user) =>
          user &&
          user.followingSpaces.map(({id}) => ({
            spaceId: id,
            userTwitterId: twitterId,
          })),
      );
  }

  async resolveFollowingSpaces(
    twitterId: string,
    {finished}: {finished: boolean},
  ): Promise<FollowingEntity[] | null> {
    return this.prismaService.user
      .findUnique({
        where: {twitterId},
        select: {
          followingSpaces: {
            where: {finished},
            select: {id: true},
          },
        },
      })
      .then(
        (user) =>
          user &&
          user.followingSpaces.map(({id}) => ({
            spaceId: id,
            userTwitterId: twitterId,
          })),
      );
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
