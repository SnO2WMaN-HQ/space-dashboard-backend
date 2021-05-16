import {ArgsType, Field, ID} from '@nestjs/graphql';
import {
  IsDateString,
  IsOptional,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {LocalDateResolver} from 'graphql-scalars';

@ArgsType()
export class CreateSpaceArgs {
  @Field(() => String)
  @MaxLength(40)
  title!: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsUrl()
  minutesUrl?: string;

  @Field(() => LocalDateResolver)
  @IsDateString()
  openDate!: string;

  @Field(() => ID)
  @IsUUID()
  hostUserId!: string;
}
