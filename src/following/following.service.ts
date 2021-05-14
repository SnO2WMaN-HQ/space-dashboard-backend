import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {FollowingEntity} from './following.entities';

@Injectable()
export class FollowingService {
  constructor(private prismaService: PrismaService) {}

  async upsertFollowing({
    userId,
    spaceId,
  }: {
    userId: string;
    spaceId: string;
  }): Promise<FollowingEntity> {
    return this.prismaService.following.upsert({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      where: {spaceId_userId: {spaceId, userId}},
      create: {spaceId, userId},
      update: {},
    });
  }
}
