import {Prisma} from '.prisma/client';
import {Injectable} from '@nestjs/common';
import {FollowingConnectionEntity} from '../following/following.entities';
import {HostingEntity} from '../hosting/hosting.entities';
import {PrismaService} from '../prisma/prisma.service';
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
        hostUserTwitterId: true,
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
        hostUserTwitterId: true,
        followingUsers: {select: {id: true}},
      },
    });
  }

  resolveHostUser({id, hostUserTwitterId}: SpaceEntity): HostingEntity {
    return {userTwitterId: hostUserTwitterId, spaceId: id};
  }

  async resolveFollowingUsers(
    spaceId: string,
    params: {take: number} | {cursor: string; take: number},
    orderBy: {updatedAt: Prisma.SortOrder},
  ): Promise<FollowingConnectionEntity | null> {
    return ('cursor' in params
      ? this.prismaService.following.findMany({
          where: {spaceId},
          cursor: {id: params.cursor},
          skip: 1,
          take: params.take,
          select: {id: true, userTwitterId: true, spaceId: true},
          orderBy,
        })
      : this.prismaService.following.findMany({
          where: {spaceId},
          take: params.take,
          select: {id: true, userTwitterId: true, spaceId: true},
          orderBy,
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
}
