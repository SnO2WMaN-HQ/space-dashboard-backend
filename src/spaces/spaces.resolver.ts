import {NotFoundException} from '@nestjs/common';
import {Args, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {FollowingEntity} from '../following/following.entity';
import {HostingEntity} from '../hosting/hosting.entity';
import {FindSpaceArgs} from './dto/find-space.dto';
import {SpaceEntity} from './space.entity';
import {SpacesService} from './spaces.service';

@Resolver(() => SpaceEntity)
export class SpacesResolver {
  constructor(private readonly spacesService: SpacesService) {}

  @ResolveField(() => HostingEntity)
  hostUser(@Parent() parent: SpaceEntity): HostingEntity {
    return this.spacesService.resolveHostUser(parent);
  }

  @ResolveField(() => [FollowingEntity])
  followingUsers(@Parent() parent: SpaceEntity): FollowingEntity[] {
    return this.spacesService.resolveFollowingUsers(parent);
  }

  @Query(() => SpaceEntity, {name: 'space'})
  async findSpace(@Args() {id}: FindSpaceArgs): Promise<SpaceEntity> {
    const result = await this.spacesService.findById(id);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Query(() => [SpaceEntity])
  async allSpaces(): Promise<SpaceEntity[]> {
    return this.spacesService.all();
  }
}
