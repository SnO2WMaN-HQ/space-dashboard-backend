import {NotFoundException} from '@nestjs/common';
import {Args, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {FollowingEntity} from '../following/following.entity';
import {HostingEntity} from '../hosting/hosting.entity';
import {FindUserArgs} from './dto/find-user.dto';
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

  @ResolveField(() => [HostingEntity])
  async hostedSpaces(
    @Parent()
    {twitterId}: UserEntity,
    @Args({type: () => ResolveHostedSpacesArgs})
    {finished}: ResolveHostedSpacesArgs,
  ): Promise<HostingEntity[]> {
    const result = await this.usersService.resolveHostedSpaces(twitterId, {
      finished,
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  @ResolveField(() => [FollowingEntity])
  async followingSpaces(
    @Parent()
    {twitterId}: UserEntity,
    @Args({type: () => ResolveFollowingSpacesArgs})
    {finished}: ResolveFollowingSpacesArgs,
  ): Promise<FollowingEntity[]> {
    const result = await this.usersService.resolveFollowingSpaces(twitterId, {
      finished,
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  @ResolveField(() => Boolean)
  async spaceFollowing(
    @Parent() {twitterId}: UserEntity,
    @Args('spaceId', {type: () => String}) spaceId: string,
  ): Promise<boolean> {
    const result = await this.usersService.spaceFollowing(twitterId, spaceId);
    if (result === null) throw new NotFoundException();
    return result;
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
}
