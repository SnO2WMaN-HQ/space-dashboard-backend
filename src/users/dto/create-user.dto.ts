import {ArgsType, Field, ID} from '@nestjs/graphql';
import {IsUrl, MaxLength, MinLength} from 'class-validator';

@ArgsType()
export class CreateUserArgs {
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
