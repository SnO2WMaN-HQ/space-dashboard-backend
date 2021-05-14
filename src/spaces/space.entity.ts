import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType('Space')
export class SpaceEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => Boolean)
  finished!: boolean;

  @Field(() => String)
  title!: string;

  @Field(() => String, {nullable: true})
  description?: string | null;

  @Field(() => String, {nullable: true})
  minutesUrl?: string | null;

  openDate!: Date;

  hostUserTwitterId!: string;
  followingUsers!: {twitterId: string}[];
}
