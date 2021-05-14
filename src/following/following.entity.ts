import {ObjectType} from '@nestjs/graphql';

@ObjectType('Following')
export class FollowingEntity {
  id!: string;
  spaceId!: string;
  userId!: string;
}
