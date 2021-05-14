import {Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {SpaceEntity} from '../spaces/space.entity';
import {SpacesService} from '../spaces/spaces.service';
import {UserEntity} from '../users/user.entity';
import {UsersService} from '../users/users.service';
import {FollowingConnectionEntity, FollowingEntity} from './following.entities';

@Resolver(() => FollowingEntity)
export class FollowingResolver {
  constructor(
    private readonly spacesService: SpacesService,
    private readonly usersService: UsersService,
  ) {}

  @ResolveField(() => SpaceEntity)
  space(@Parent() {spaceId}: FollowingEntity) {
    return this.spacesService.findById(spaceId);
  }

  @ResolveField(() => UserEntity)
  user(@Parent() {userTwitterId: twitterId}: FollowingEntity) {
    return this.usersService.findOne({twitterId});
  }
}

@Resolver(() => FollowingConnectionEntity)
export class FollowingConnectionResolver {
  constructor(private readonly spacesService: SpacesService) {}
}
