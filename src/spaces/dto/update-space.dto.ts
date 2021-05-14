import {ArgsType, Field, ID} from '@nestjs/graphql';
import {IsOptional, IsUrl, IsUUID, MaxLength} from 'class-validator';

@ArgsType()
export class UpdateSpaceArgs {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => String, {nullable: true})
  @MaxLength(40)
  title?: string;

  @Field(() => String, {nullable: true})
  @MaxLength(200)
  @IsOptional()
  description?: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsUrl()
  minutesUrl?: string;
}
