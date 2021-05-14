import {ArgsType, Field, ID} from '@nestjs/graphql';
import {IsUUID} from 'class-validator';

@ArgsType()
export class FollowSpaceArgs {
  @Field(() => ID)
  @IsUUID()
  userId!: string;

  @Field(() => ID)
  @IsUUID()
  spaceId!: string;
}
