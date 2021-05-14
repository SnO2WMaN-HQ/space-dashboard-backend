import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType('User')
export class UserEntity {
  @Field(() => ID)
  twitterId!: string;

  @Field(() => ID)
  uniqueName!: string;

  @Field(() => ID)
  displayName!: string;

  @Field(() => ID)
  picture!: string;

  hostedSpaces!: {id: string}[];
  followingSpaces!: {id: string}[];
}
