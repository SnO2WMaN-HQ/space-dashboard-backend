import {ArgsType, Field, ID, InputType} from '@nestjs/graphql';

@InputType()
export class EnsureUserData {
  @Field(() => ID)
  twitterId!: string;

  @Field(() => ID)
  uniqueName!: string;

  @Field(() => String)
  displayName!: string;

  @Field(() => String)
  picture!: string;
}

@ArgsType()
export class EnsureUserArgs {
  @Field(() => EnsureUserData)
  data!: EnsureUserData;
}
