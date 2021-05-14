import {NotFoundException, UsePipes, ValidationPipe} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {LocalDateResolver} from 'graphql-scalars';
import {HostingEntity} from '../hosting/hosting.entity';
import {CreateSpaceArgs} from './dto/create-space.dto';
import {FindSpaceArgs} from './dto/find-space.dto';
import {FinishSpaceArgs} from './dto/finish-space.dto';
import {
  SpaceFollowingUsersArgs,
  SpaceFollowingUsersConnection,
} from './dto/resolve-following-users.dto';
import {UpdateSpaceArgs} from './dto/update-space.dto';
import {SpaceEntity} from './space.entity';
import {SpacesService} from './spaces.service';

@Resolver(() => SpaceEntity)
export class SpacesResolver {
  constructor(private readonly spacesService: SpacesService) {}

  @ResolveField(() => HostingEntity)
  async hostUser(@Parent() parent: SpaceEntity): Promise<HostingEntity> {
    return this.spacesService.resolveHostUser(parent);
  }

  @ResolveField(() => SpaceFollowingUsersConnection)
  async followingUsers(
    @Parent() {id}: SpaceEntity,
    @Args({type: () => SpaceFollowingUsersArgs})
    {orderBy, ...params}: SpaceFollowingUsersArgs,
  ): Promise<SpaceFollowingUsersConnection> {
    const result = await this.spacesService.getFollowingUsers(
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

  @Mutation(() => SpaceEntity)
  @UsePipes(new ValidationPipe())
  async createSpace(
    @Args({type: () => CreateSpaceArgs}) {...data}: CreateSpaceArgs,
  ): Promise<SpaceEntity> {
    return this.spacesService.createSpace(data);
  }

  @Mutation(() => SpaceEntity)
  async updateSpace(
    @Args({type: () => UpdateSpaceArgs}) {id, ...data}: UpdateSpaceArgs,
  ): Promise<SpaceEntity> {
    return this.spacesService.updateSpace(id, data);
  }

  @Mutation(() => SpaceEntity)
  async finishSpace(
    @Args({type: () => FinishSpaceArgs}) {id}: FinishSpaceArgs,
  ): Promise<SpaceEntity> {
    return this.spacesService.finishSpace(id);
  }
}
