import {ArgsType, Field, ID} from '@nestjs/graphql';

@ArgsType()
export class FindUserArgs {
  @Field(() => ID, {nullable: true})
  id?: string;

  @Field(() => ID, {nullable: true})
  uniqueName?: string;
}
