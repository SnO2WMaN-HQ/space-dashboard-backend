import {ArgsType, Field, InputType, Int} from '@nestjs/graphql';
import {Min} from 'class-validator';
import {OrderBy} from '../../paginate/order-by.enum';

@InputType('ResolveFollowingUsersArgsOrderBy')
export class ResolveFollowingUsersArgsOrderBy {
  @Field(() => OrderBy, {nullable: true, defaultValue: OrderBy.DESC})
  updatedAt!: OrderBy;
}

@ArgsType()
export class ResolveFollowingUsersArgs {
  @Field(() => String, {nullable: true})
  after?: string;

  @Field(() => Int)
  @Min(1)
  first!: number;

  @Field(() => ResolveFollowingUsersArgsOrderBy, {
    defaultValue: new ResolveFollowingUsersArgsOrderBy(),
  })
  orderBy!: ResolveFollowingUsersArgsOrderBy;
}
