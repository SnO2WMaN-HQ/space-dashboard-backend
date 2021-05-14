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

  @ResolveField(() => [HostingEntity])
  hostedSpaces(user: UserEntity) {
    return this.usersService.resolveHostedSpaces(user);
  }

  @ResolveField(() => [FollowingEntity])
  followingSpaces(user: UserEntity) {
    return this.usersService.resolveFollowingSpaces(user);
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
  async findUser(@Args() args: FindUserArgs) {
    const result = await this.usersService.findOne(args);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Query(() => [UserEntity])
  async allUsers() {
    return this.usersService.all();
  }
}
