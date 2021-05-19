import {ArgsType, Field, ID} from '@nestjs/graphql';
import {IsUrl, IsUUID, MaxLength, MinLength} from 'class-validator';

@ArgsType()
export class UpdateUserArgs {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => ID)
  @MinLength(4)
  @MaxLength(15)
  uniqueName!: string;

  @Field(() => String)
  @MinLength(0)
  @MaxLength(50)
  displayName!: string;

  @Field(() => String)
  @IsUrl()
  picture!: string;
}
