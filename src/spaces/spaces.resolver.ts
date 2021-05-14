import {NotFoundException} from '@nestjs/common';
import {Args, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {LocalDateResolver} from 'graphql-scalars';
import {FollowingConnectionEntity} from '../following/following.entities';
import {HostingEntity} from '../hosting/hosting.entities';
import {FindSpaceArgs} from './dto/find-space.dto';
import {ResolveFollowingUsersArgs} from './dto/resolve-following-users.dto';
import {SpaceEntity} from './space.entity';
import {SpacesService} from './spaces.service';

@Resolver(() => SpaceEntity)
export class SpacesResolver {
  constructor(private readonly spacesService: SpacesService) {}

  @ResolveField(() => HostingEntity)
  async hostUser(@Parent() parent: SpaceEntity): Promise<HostingEntity> {
    return this.spacesService.resolveHostUser(parent);
  }

  @ResolveField(() => FollowingConnectionEntity)
  async followingUsers(
    @Parent() {id}: SpaceEntity,
    @Args({type: () => ResolveFollowingUsersArgs})
    {orderBy, ...params}: ResolveFollowingUsersArgs,
  ): Promise<FollowingConnectionEntity> {
    const result = await this.spacesService.resolveFollowingUsers(
      id,
      params.after
        ? {take: params.first, cursor: params.after}
        : {take: params.first},
      orderBy,
    );
    if (!result) throw new NotFoundException();
    return result;
  }

  @ResolveField(() => LocalDateResolver)
  openDate(@Parent() {openDate}: SpaceEntity): string {
    return this.spacesService.formatLocalDate(openDate);
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
