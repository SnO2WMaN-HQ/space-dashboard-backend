import {ObjectType} from '@nestjs/graphql';

@ObjectType('Following')
export class FollowingEntity {
  spaceId!: string;
  userTwitterId!: string;
}
