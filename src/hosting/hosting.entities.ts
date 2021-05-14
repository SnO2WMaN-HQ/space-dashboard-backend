import {Field, ObjectType} from '@nestjs/graphql';
import {PageInfoEntity} from '../paginate/page-info.entity';

@ObjectType('Hosting')
export class HostingEntity {
  spaceId!: string;
  userId!: string;
}

@ObjectType('HostingEdge')
export class HostingEdgeEntity {
  @Field(() => String)
  cursor!: string;

  @Field(() => HostingEntity)
  node!: HostingEntity;
}

@ObjectType('HostingConnection')
export class HostingConnectionEntity {
  @Field(() => [HostingEdgeEntity])
  edges!: HostingEdgeEntity[];

  @Field(() => PageInfoEntity)
  pageInfo!: PageInfoEntity;
}
