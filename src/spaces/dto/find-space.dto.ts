import {ArgsType, Field, ID} from '@nestjs/graphql';
import {IsUUID} from 'class-validator';

@ArgsType()
export class FindSpaceArgs {
  @Field(() => ID)
  @IsUUID()
  id!: string;
}
