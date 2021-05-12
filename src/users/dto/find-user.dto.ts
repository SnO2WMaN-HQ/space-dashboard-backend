import {ArgsType, Field, ID} from '@nestjs/graphql';

@ArgsType()
export class FindUserArgs {
  @Field(() => ID)
  twitterId!: string;
}
