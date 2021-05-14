import {ArgsType, Field, InputType, Int, ObjectType} from '@nestjs/graphql';
import {Min} from 'class-validator';
import {FollowingEntity} from '../../following/following.entity';
import {OrderBy} from '../../paginate/order-by.enum';
import {PageInfoEntity} from '../../paginate/page-info.entity';

@InputType()
export class UserFollowingSpacesArgsOrderBy {
  @Field(() => OrderBy, {nullable: true, defaultValue: OrderBy.DESC})
  updatedAt!: OrderBy;
}

@ArgsType()
export class UserFollowingSpacesArgs {
  @Field((_type) => String, {nullable: true})
  after?: string;

  @Field(() => Int)
  @Min(1)
  first!: number;

  @Field(() => Boolean, {defaultValue: false})
  finished!: boolean;

  @Field(() => UserFollowingSpacesArgsOrderBy, {
    defaultValue: new UserFollowingSpacesArgsOrderBy(),
  })
  orderBy!: UserFollowingSpacesArgsOrderBy;
}

@ObjectType()
export class UserFollowingSpacesEdge {
  @Field(() => String)
  cursor!: string;

  @Field(() => FollowingEntity)
  node!: FollowingEntity;
}

@ObjectType()
export class UserFollowingSpacesConnection {
  @Field(() => [UserFollowingSpacesEdge])
  edges!: UserFollowingSpacesEdge[];

  @Field(() => PageInfoEntity)
  pageInfo!: PageInfoEntity;
}
