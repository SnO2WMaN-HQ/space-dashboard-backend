import {Prisma} from '.prisma/client';
import {Injectable} from '@nestjs/common';
import {HostingEntity} from '../hosting/hosting.entity';
import {PrismaService} from '../prisma/prisma.service';
import {SpaceFollowingUsersConnection} from './dto/resolve-following-users.dto';
import {SpaceEntity} from './space.entity';

@Injectable()
export class SpacesService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<SpaceEntity | null> {
    return this.prismaService.space.findUnique({
      where: {id},
      select: {
        id: true,
        finished: true,
        title: true,
        description: true,
        minutesUrl: true,
        openDate: true,
        hostUserId: true,
        followingUsers: {select: {id: true}},
      },
    });
  }

  async all(): Promise<SpaceEntity[]> {
    return this.prismaService.space.findMany({
      select: {
        id: true,
        finished: true,
        title: true,
        description: true,
        minutesUrl: true,
        openDate: true,
        hostUserId: true,
        followingUsers: {select: {id: true}},
      },
    });
  }

  resolveHostUser({id, hostUserId}: SpaceEntity): HostingEntity {
    return {userId: hostUserId, spaceId: id};
  }

  async getFollowingUsers(
    spaceId: string,
    params: {take: number} | {cursor: string; take: number},
    orderBy: {updatedAt: Prisma.SortOrder},
  ): Promise<SpaceFollowingUsersConnection | null> {
    return ('cursor' in params
      ? this.prismaService.following.findMany({
          where: {spaceId},
          cursor: {id: params.cursor},
          skip: 1,
          take: params.take,
          select: {id: true, userId: true, spaceId: true},
          orderBy,
        })
      : this.prismaService.following.findMany({
          where: {spaceId},
          take: params.take,
          select: {id: true, userId: true, spaceId: true},
          orderBy,
        })
    ).then((followings) => ({
      edges: followings.map(({id, spaceId, userId}) => ({
        cursor: id,
        node: {id, spaceId, userId},
      })),
      pageInfo: {
        endCursor: followings[followings.length - 1]?.id,
        hasNextPage: followings.length === params.take,
      },
    }));
  }

  async countFollowingTotal(spaceId: string): Promise<number> {
    return this.prismaService.following.count({where: {id: spaceId}});
  }

  formatLocalDate(date: Date) {
    return [
      `${date.getFullYear()}`.padStart(4, '0'),
      `${date.getUTCMonth() + 1}`.padStart(2, '0'),
      `${date.getDate()}`.padStart(2, '0'),
    ].join('-');
  }

  async createSpace({
    openDate,
    ...rest
  }: {
    title: string;
    description?: string;
    minutesUrl?: string;
    openDate: string;
    hostUserId: string;
  }): Promise<SpaceEntity> {
    return this.prismaService.space.create({
      data: {
        finished: false,
        openDate: new Date(openDate),
        ...rest,
      },
    });
  }

  async isHostUser(spaceId: string, userId: string) {
    return this.prismaService.space
      .findUnique({
        where: {id: spaceId},
        select: {hostUserId: true},
      })
      .then((space) => space && space.hostUserId === userId);
  }

  async updateSpace(
    spaceId: string,
    data: {title?: string; description?: string; minutesUrl?: string},
  ): Promise<SpaceEntity> {
    return this.prismaService.space.update({
      where: {id: spaceId},
      data,
    });
  }

  async finishSpace(spaceId: string): Promise<SpaceEntity> {
    return this.prismaService.space.update({
      where: {id: spaceId},
      data: {finished: true},
    });
  }
}
