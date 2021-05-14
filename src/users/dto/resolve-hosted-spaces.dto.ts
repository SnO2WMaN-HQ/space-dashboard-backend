import {ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class ResolveHostedSpacesArgs {
  @Field(() => Boolean, {defaultValue: false})
  finished!: boolean;
}
