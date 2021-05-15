import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prismaService: PrismaService) {}

  async ensureAccount(where: {
    twitterId: string;
  }): Promise<{user: {id: string} | null}> {
    return this.prismaService.account.upsert({
      where,
      create: where,
      update: {},
      select: {user: {select: {id: true}}},
    });
  }
}
