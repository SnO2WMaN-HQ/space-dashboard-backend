import {Injectable} from '@nestjs/common';
import {FollowingEntity} from '../following/following.entity';
import {HostingEntity} from '../hosting/hosting.entity';
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
        followingUsers: {select: {twitterId: true}},
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
        followingUsers: {
          select: {twitterId: true},
        },
      },
    });
  }

  resolveHostUser({id, hostUserTwitterId}: SpaceEntity): HostingEntity {
    return {userTwitterId: hostUserTwitterId, spaceId: id};
  }

  resolveFollowingUsers({id, followingUsers}: SpaceEntity): FollowingEntity[] {
    return followingUsers.map(({twitterId}) => ({
      spaceId: id,
      userTwitterId: twitterId,
    }));
  }

  formatLocalDate(date: Date) {
    return [
      `${date.getFullYear()}`.padStart(4, '0'),
      `${date.getUTCMonth() + 1}`.padStart(2, '0'),
      `${date.getDate()}`.padStart(2, '0'),
    ].join('-');
  }
}
