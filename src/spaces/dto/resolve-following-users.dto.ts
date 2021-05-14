import {ArgsType, Field, InputType, Int, ObjectType} from '@nestjs/graphql';
import {Min} from 'class-validator';
import {FollowingEntity} from '../../following/following.entity';
import {OrderBy} from '../../paginate/order-by.enum';
import {PageInfoEntity} from '../../paginate/page-info.entity';

@InputType()
export class SpaceFollowingUsersArgsOrderBy {
  @Field(() => OrderBy, {nullable: true, defaultValue: OrderBy.DESC})
  updatedAt!: OrderBy;
}

@ArgsType()
export class SpaceFollowingUsersArgs {
  @Field(() => String, {nullable: true})
  after?: string;

  @Field(() => Int)
  @Min(1)
  first!: number;

  @Field(() => SpaceFollowingUsersArgsOrderBy, {
    defaultValue: new SpaceFollowingUsersArgsOrderBy(),
  })
  orderBy!: SpaceFollowingUsersArgsOrderBy;
}

@ObjectType()
export class SpaceFollowingUsersEdge {
  @Field(() => String)
  cursor!: string;

  @Field(() => FollowingEntity)
  node!: FollowingEntity;
}

@ObjectType()
export class SpaceFollowingUsersConnection {
  @Field(() => [SpaceFollowingUsersEdge])
  edges!: SpaceFollowingUsersEdge[];

  @Field(() => PageInfoEntity)
  pageInfo!: PageInfoEntity;
}
