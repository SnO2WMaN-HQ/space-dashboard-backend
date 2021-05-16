import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType('PageInfo')
export class PageInfoEntity {
  @Field(() => String, {nullable: true})
  endCursor?: string;

  @Field(() => Boolean)
  hasNextPage!: boolean;
}
