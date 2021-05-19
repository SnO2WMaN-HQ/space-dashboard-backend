import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prismaService: PrismaService) {}

  async ensureAccount(where: {
    twitterId: string;
  }): Promise<{account: {id: string}; user: {id: string} | null}> {
    return this.prismaService.account
      .upsert({
        where,
        create: where,
        update: {},
        select: {
          id: true,
          user: {select: {id: true}},
        },
      })
      .then(({id, user}) => ({account: {id}, user}));
  }
}
