import {ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class ResolveFollowingSpacesArgs {
  @Field(() => Boolean, {defaultValue: false})
  finished!: boolean;
}
