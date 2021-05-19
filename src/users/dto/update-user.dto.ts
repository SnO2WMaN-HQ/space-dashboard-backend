import {ArgsType, Field, ID} from '@nestjs/graphql';
import {IsUrl, IsUUID, Max, MaxLength, Min, MinLength} from 'class-validator';

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
  @Min(0)
  @Max(50)
  displayName!: string;

  @Field(() => String)
  @IsUrl()
  picture!: string;
}
