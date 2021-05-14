import {NotFoundException, UseGuards} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {URL} from 'url';
import {CurrentUser, CurrentUserPayload} from '../auth/current-user.decorator';
import {GqlAuthGuard} from '../auth/gql-auth.guard';
import {EnsureUserArgs} from './dto/ensure-user.dto';
import {FindUserArgs} from './dto/find-user.dto';
import {
  UserFollowingSpacesArgs,
  UserFollowingSpacesConnection,
} from './dto/resolve-following-spaces.dto';
import {
  UserHostedSpacesArgs,
  UserHostedSpacesConnection,
} from './dto/resolve-hosted-spaces.dto';
import {UserEntity} from './user.entity';
import {UsersService} from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField(() => String)
  twitterUrl(
    @Parent()
    {uniqueName}: UserEntity,
  ): string {
    return new URL(uniqueName, 'https://twitter.com').toString();
  }

  @ResolveField(() => UserHostedSpacesConnection)
  async hostedSpaces(
    @Parent()
    {id}: UserEntity,
    @Args({type: () => UserHostedSpacesArgs})
    {finished, orderBy, ...params}: UserHostedSpacesArgs,
  ): Promise<UserHostedSpacesConnection> {
    const result = await this.usersService.getHostedSpaces(
      id,
      params.after
        ? {take: params.first, cursor: params.after}
        : {take: params.first},
      {finished},
      orderBy,
    );
    if (!result) throw new NotFoundException();
    return result;
  }

  @ResolveField(() => UserFollowingSpacesConnection)
  async followingSpaces(
    @Parent()
    {id}: UserEntity,
    @Args({type: () => UserFollowingSpacesArgs})
    {finished, orderBy, ...params}: UserFollowingSpacesArgs,
  ): Promise<UserFollowingSpacesConnection> {
    const result = await this.usersService.getFollowingSpaces(
      id,
      params.after
        ? {take: params.first, cursor: params.after}
        : {take: params.first},
      {finished},
      orderBy,
    );
    if (!result) throw new NotFoundException();
    return result;
  }

  @ResolveField(() => Boolean)
  async isFollowingSpace(
    @Parent() {id}: UserEntity,
    @Args('spaceId', {type: () => String}) spaceId: string,
  ): Promise<boolean> {
    return this.usersService.isSpaceFollowing(id, spaceId);
  }

  @Query(() => UserEntity, {name: 'user'})
  async findUser(@Args() args: FindUserArgs): Promise<UserEntity> {
    const result = await this.usersService.findOne(args);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Query(() => [UserEntity])
  async allUsers(): Promise<UserEntity[]> {
    return this.usersService.all();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserEntity)
  async currentUser(
    @CurrentUser()
    {id: currentUserId}: CurrentUserPayload,
  ) {
    return this.usersService.findOne({id: currentUserId});
  }

  @Mutation(() => UserEntity)
  async ensureUser(
    @Args({type: () => EnsureUserArgs}) {data}: EnsureUserArgs,
  ): Promise<UserEntity> {
    return this.usersService.ensureUser(data);
  }
}
