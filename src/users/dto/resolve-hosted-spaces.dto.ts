import {ArgsType, Field, InputType, Int} from '@nestjs/graphql';
import {Min} from 'class-validator';
import {OrderBy} from '../../paginate/order-by.enum';

@InputType('ResolveHostedSpacesArgsOrderBy')
export class ResolveHostedSpacesArgsOrderBy {
  @Field(() => OrderBy, {nullable: true, defaultValue: OrderBy.DESC})
  openDate!: OrderBy;
}

@ArgsType()
export class ResolveHostedSpacesArgs {
  @Field((_type) => String, {nullable: true})
  after?: string;

  @Field(() => Int)
  @Min(1)
  first!: number;

  @Field(() => Boolean, {defaultValue: false})
  finished!: boolean;

  @Field(() => ResolveHostedSpacesArgsOrderBy, {
    defaultValue: new ResolveHostedSpacesArgsOrderBy(),
  })
  orderBy!: ResolveHostedSpacesArgsOrderBy;
}
