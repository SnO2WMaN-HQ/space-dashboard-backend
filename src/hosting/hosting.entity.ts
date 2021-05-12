import {ObjectType} from '@nestjs/graphql';

@ObjectType('Hosting')
export class HostingEntity {
  spaceId!: string;
  userTwitterId!: string;
}
