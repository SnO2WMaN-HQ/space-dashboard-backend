import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType('User')
export class UserEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  uniqueName!: string;

  @Field(() => String)
  displayName!: string;

  @Field(() => String)
  picture!: string;
}
