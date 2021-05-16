import {ArgsType, Field, InputType, Int, ObjectType} from '@nestjs/graphql';
import {Min} from 'class-validator';
import {HostingEntity} from '../../hosting/hosting.entity';
import {OrderBy} from '../../paginate/order-by.enum';
import {PageInfoEntity} from '../../paginate/page-info.entity';

@InputType()
export class UserHostedSpacesArgsOrderBy {
  @Field(() => OrderBy, {nullable: true, defaultValue: OrderBy.DESC})
  openDate!: OrderBy;
}

@ArgsType()
export class UserHostedSpacesArgs {
  @Field((_type) => String, {nullable: true})
  after?: string;

  @Field(() => Int)
  @Min(1)
  first!: number;

  @Field(() => Boolean, {defaultValue: false})
  finished!: boolean;

  @Field(() => UserHostedSpacesArgsOrderBy, {
    defaultValue: new UserHostedSpacesArgsOrderBy(),
  })
  orderBy!: UserHostedSpacesArgsOrderBy;
}

@ObjectType()
export class UserHostedSpacesEdge {
  @Field(() => String)
  cursor!: string;

  @Field(() => HostingEntity)
  node!: HostingEntity;
}

@ObjectType()
export class UserHostedSpacesConnection {
  @Field(() => [UserHostedSpacesEdge])
  edges!: UserHostedSpacesEdge[];

  @Field(() => PageInfoEntity)
  pageInfo!: PageInfoEntity;
}
