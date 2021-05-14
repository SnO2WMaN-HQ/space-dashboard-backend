import {Prisma} from '.prisma/client';
import {Injectable} from '@nestjs/common';
import {FollowingConnectionEntity} from '../following/following.entities';
import {HostingConnectionEntity} from '../hosting/hosting.entities';
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

  async getHostedSpaces(
    userTwitterId: string,
    params: {take: number} | {cursor: string; take: number},
    conditions: {finished: boolean},
    orderBy: {openDate: Prisma.SortOrder},
  ): Promise<HostingConnectionEntity | null> {
    return ('cursor' in params
      ? this.prismaService.space.findMany({
          where: {
            hostUserTwitterId: userTwitterId,
            finished: conditions.finished,
          },
          cursor: {id: params.cursor},
          skip: 1,
          take: params.take,
          select: {id: true, hostUserTwitterId: true},
          orderBy: {openDate: orderBy.openDate},
        })
      : this.prismaService.space.findMany({
          where: {
            hostUserTwitterId: userTwitterId,
            finished: conditions.finished,
          },
          take: params.take,
          select: {id: true, hostUserTwitterId: true},
          orderBy: {openDate: orderBy.openDate},
        })
    ).then((followings) => ({
      edges: followings.map(({id, hostUserTwitterId}) => ({
        cursor: id,
        node: {spaceId: id, userTwitterId: hostUserTwitterId},
      })),
      pageInfo: {
        endCursor: followings[followings.length - 1]?.id,
        hasNextPage: followings.length === params.take,
      },
    }));
  }

  async getFollowingSpaces(
    userTwitterId: string,
    params: {take: number} | {cursor: string; take: number},
    conditions: {finished: boolean},
    orderBy: {updatedAt: Prisma.SortOrder},
  ): Promise<FollowingConnectionEntity | null> {
    return ('cursor' in params
      ? this.prismaService.following.findMany({
          where: {userTwitterId, space: {finished: conditions.finished}},
          cursor: {id: params.cursor},
          skip: 1,
          take: params.take,
          select: {id: true, spaceId: true, userTwitterId: true},
          orderBy: {updatedAt: orderBy.updatedAt},
        })
      : this.prismaService.following.findMany({
          where: {userTwitterId, space: {finished: conditions.finished}},
          take: params.take,
          select: {id: true, spaceId: true, userTwitterId: true},
          orderBy: {updatedAt: orderBy.updatedAt},
        })
    ).then((followings) => ({
      edges: followings.map(({id, spaceId, userTwitterId}) => ({
        cursor: id,
        node: {id, spaceId, userTwitterId},
      })),
      pageInfo: {
        endCursor: followings[followings.length - 1]?.id,
        hasNextPage: followings.length === params.take,
      },
    }));
  }

  async isSpaceFollowing(
    userTwitterId: string,
    spaceId: string,
  ): Promise<boolean> {
    return this.prismaService.following
      .findUnique({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          spaceId_userTwitterId: {spaceId, userTwitterId},
        },
      })
      .then((following) => Boolean(following));
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
