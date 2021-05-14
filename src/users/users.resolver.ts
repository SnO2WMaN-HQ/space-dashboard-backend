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
import {FollowingConnectionEntity} from '../following/following.entities';
import {HostingConnectionEntity} from '../hosting/hosting.entities';
import {EnsureUserArgs} from './dto/ensure-user.dto';
import {FindUserArgs} from './dto/find-user.dto';
import {ResolveFollowingSpacesArgs} from './dto/resolve-following-spaces.dto';
import {ResolveHostedSpacesArgs} from './dto/resolve-hosted-spaces.dto';
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

  @ResolveField(() => HostingConnectionEntity)
  async hostedSpaces(
    @Parent()
    {id}: UserEntity,
    @Args({type: () => ResolveHostedSpacesArgs})
    {finished, orderBy, ...params}: ResolveHostedSpacesArgs,
  ): Promise<HostingConnectionEntity> {
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

  @ResolveField(() => FollowingConnectionEntity)
  async followingSpaces(
    @Parent()
    {id}: UserEntity,
    @Args({type: () => ResolveFollowingSpacesArgs})
    {finished, orderBy, ...params}: ResolveFollowingSpacesArgs,
  ): Promise<FollowingConnectionEntity> {
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
  async spaceFollowing(
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
    {id}: CurrentUserPayload,
  ) {
    return this.usersService.findOne({id});
  }

  @Mutation(() => UserEntity)
  async ensureUser(
    @Args({type: () => EnsureUserArgs}) {data}: EnsureUserArgs,
  ): Promise<UserEntity> {
    return this.usersService.ensureUser(data);
  }
}
