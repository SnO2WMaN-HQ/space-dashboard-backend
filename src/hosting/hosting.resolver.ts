import {Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {SpaceEntity} from '../spaces/space.entity';
import {SpacesService} from '../spaces/spaces.service';
import {UserEntity} from '../users/user.entity';
import {UsersService} from '../users/users.service';
import {HostingEntity} from './hosting.entity';

@Resolver(() => HostingEntity)
export class HostingResolver {
  constructor(
    private readonly spacesService: SpacesService,
    private readonly usersService: UsersService,
  ) {}

  @ResolveField(() => SpaceEntity)
  space(@Parent() {spaceId}: HostingEntity) {
    return this.spacesService.findById(spaceId);
  }

  @ResolveField(() => UserEntity)
  user(@Parent() {userTwitterId: twitterId}: HostingEntity) {
    return this.usersService.findByTwitterId(twitterId);
  }
}
