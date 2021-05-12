import {ArgsType, Field, ID} from '@nestjs/graphql';

@ArgsType()
export class FindSpaceArgs {
  @Field(() => ID)
  id!: string;
}
