import {Field, ObjectType} from '@nestjs/graphql';
import {PageInfoEntity} from '../paginate/page-info.entity';

@ObjectType('Following')
export class FollowingEntity {
  id!: string;
  spaceId!: string;
  userId!: string;
}

@ObjectType('FollowingEdge')
export class FollowingEdgeEntity {
  @Field(() => String)
  cursor!: string;

  @Field(() => FollowingEntity)
  node!: FollowingEntity;
}

@ObjectType('FollowingConnection')
export class FollowingConnectionEntity {
  @Field(() => [FollowingEdgeEntity])
  edges!: FollowingEdgeEntity[];

  @Field(() => PageInfoEntity)
  pageInfo!: PageInfoEntity;
}
