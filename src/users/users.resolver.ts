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

  @Query(() => UserEntity, {name: 'user'})
  async findUser(@Args() {twitterId}: FindUserArgs) {
    const result = await this.usersService.findByTwitterId(twitterId);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Query(() => [UserEntity])
  async allUsers() {
    return this.usersService.all();
  }
}
