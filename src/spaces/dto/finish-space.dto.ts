import {ArgsType, Field, ID} from '@nestjs/graphql';
import {IsUUID} from 'class-validator';

@ArgsType()
export class FinishSpaceArgs {
  @Field(() => ID)
  @IsUUID()
  id!: string;
}
