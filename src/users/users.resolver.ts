import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CurrentSession,
  CurrentSessionPayload,
} from '../auth/current-session.decorator';
import {GqlAuthnGuard} from '../auth/gql-authn.guard';
import {CreateUserArgs} from './dto/create-user.dto';
import {FindUserArgs} from './dto/find-user.dto';
import {
  UserFollowingSpacesArgs,
  UserFollowingSpacesConnection,
} from './dto/resolve-following-spaces.dto';
import {
  UserHostedSpacesArgs,
  UserHostedSpacesConnection,
} from './dto/resolve-hosted-spaces.dto';
import {UpdateUserArgs} from './dto/update-user.dto';
import {UserEntity} from './user.entity';
import {UsersService} from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField(() => UserHostedSpacesConnection)
  async hostedSpaces(
    @Parent()
    {id}: UserEntity,
    @Args({type: () => UserHostedSpacesArgs})
    {finished, orderBy, ...params}: UserHostedSpacesArgs,
  ): Promise<UserHostedSpacesConnection> {
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

  @ResolveField(() => UserFollowingSpacesConnection)
  async followingSpaces(
    @Parent()
    {id}: UserEntity,
    @Args({type: () => UserFollowingSpacesArgs})
    {finished, orderBy, ...params}: UserFollowingSpacesArgs,
  ): Promise<UserFollowingSpacesConnection> {
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
  async isFollowingSpace(
    @Parent() {id}: UserEntity,
    @Args('spaceId', {type: () => ID}) spaceId: string,
  ): Promise<boolean> {
    return this.usersService.isSpaceFollowing(id, spaceId);
  }

  @Query(() => UserEntity, {name: 'user'})
  async findUser(@Args() args: FindUserArgs): Promise<UserEntity> {
    const where = this.usersService.resolveWhere(args);
    if (!where) throw new BadRequestException();

    const result = await this.usersService.findOne(where);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Query(() => [UserEntity])
  async allUsers(): Promise<UserEntity[]> {
    return this.usersService.all();
  }

  @Query(() => UserEntity, {nullable: true})
  @UseGuards(GqlAuthnGuard)
  async currentUser(
    @CurrentSession() currentUser: CurrentSessionPayload,
  ): Promise<UserEntity | null> {
    if (!currentUser.user) return currentUser.user;

    const result = await this.usersService.findOne({id: currentUser.user.id});
    if (!result) throw new NotFoundException();
    return result;
  }

  @Mutation(() => UserEntity)
  @UseGuards(GqlAuthnGuard)
  async createUser(
    @CurrentSession() current: CurrentSessionPayload,
    @Args({type: () => CreateUserArgs}) {...args}: CreateUserArgs,
  ): Promise<UserEntity> {
    return this.usersService.createUser(current.account.id, {...args});
  }

  @Mutation(() => UserEntity)
  @UseGuards(GqlAuthnGuard)
  async updateUser(
    @CurrentSession() {user: currentUser}: CurrentSessionPayload,
    @Args({type: () => UpdateUserArgs}) {id, ...data}: UpdateUserArgs,
  ): Promise<UserEntity> {
    if (!currentUser || currentUser.id !== id)
      throw new UnauthorizedException();
    return this.usersService.updateUser(id, data);
  }
}
