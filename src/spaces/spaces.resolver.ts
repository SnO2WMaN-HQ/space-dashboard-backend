import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {LocalDateResolver} from 'graphql-scalars';
import {
  CurrentSession,
  CurrentSessionPayload,
} from '../auth/current-session.decorator';
import {GqlAuthnGuard} from '../auth/gql-authn.guard';
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
  @UseGuards(GqlAuthnGuard)
  async createSpace(
    @CurrentSession() {user: currentUser}: CurrentSessionPayload,
    @Args({type: () => CreateSpaceArgs}) {hostUserId, ...data}: CreateSpaceArgs,
  ): Promise<SpaceEntity> {
    if (!currentUser || currentUser.id !== hostUserId)
      throw new UnauthorizedException();

    return this.spacesService.createSpace({hostUserId, ...data});
  }

  @Mutation(() => SpaceEntity)
  @UseGuards(GqlAuthnGuard)
  async updateSpace(
    @CurrentSession() {user: currentUser}: CurrentSessionPayload,
    @Args({type: () => UpdateSpaceArgs})
    {id: spaceId, ...data}: UpdateSpaceArgs,
  ): Promise<SpaceEntity> {
    if (
      !currentUser ||
      !(await this.spacesService.isHostUser(spaceId, currentUser.id))
    )
      throw new UnauthorizedException();

    return this.spacesService.updateSpace(spaceId, data);
  }

  @Mutation(() => SpaceEntity)
  @UseGuards(GqlAuthnGuard)
  async finishSpace(
    @CurrentSession() {user: currentUser}: CurrentSessionPayload,
    @Args({type: () => FinishSpaceArgs}) {id: spaceId}: FinishSpaceArgs,
  ): Promise<SpaceEntity> {
    if (
      !currentUser ||
      !(await this.spacesService.isHostUser(spaceId, currentUser.id))
    )
      throw new UnauthorizedException();

    return this.spacesService.finishSpace(spaceId);
  }
}
