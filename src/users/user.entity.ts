import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType('User')
export class UserEntity {
  @Field(() => ID)
  twitterId!: string;

  hostedSpaces!: {id: string}[];
  followingSpaces!: {id: string}[];
}
