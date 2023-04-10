import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../model/users.model';
import { RolesService } from './roles.service';
import { RolesModel } from '../model/roles.model';
import { RoleEnum } from '../enum/role.enum';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from '../../common/dto/page-meta-dto';
import { UserResponseDto } from '../dto/user/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel)
    private readonly userModel: typeof UsersModel,
    private rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UsersModel> {
    const newUser = await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      picture: createUserDto.picture,
      provider: createUserDto.provider,
      providerId: createUserDto.providerId,
    });

    // assign role when user is created.
    const user = await this.assignRole(newUser);

    return user;
  }

  async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserResponseDto>> {
    const users = await this.userModel.findAll({
      limit: pageOptionsDto.limit,
      offset: pageOptionsDto.offset,
      order: [['createdAt', pageOptionsDto.order]],
      include: [
        {
          model: RolesModel,
          attributes: ['code'],
        },
      ],
    });

    const itemCount = users.length;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    const usersObject = users.map((user) => {
      const userDto = new UserResponseDto(user);
      return userDto;
    });

    return new PageDto(usersObject, pageMetaDto);
  }

  async findOne(id: number) {
    const user = await this.userModel.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: RolesModel,
          attributes: ['code'],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('The user is not exist.');
    }

    return user;
  }

  async getDetail(id: number): Promise<UserResponseDto> {
    const user = await this.findOne(id);
    const response = new UserResponseDto(user);

    return response;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findOne(id);
    const updatedUser = await user.update(updateUserDto);
    const userResponse = new UserResponseDto(updatedUser);
    return userResponse;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await user.destroy();
  }

  async findUserByEmail(email: string): Promise<UsersModel> {
    const user = await this.userModel.findOne({
      where: {
        email: email,
      },
      include: [
        {
          model: RolesModel,
          attributes: ['code'],
        },
      ],
    });

    return user;
  }

  async assignRole(user: UsersModel): Promise<UsersModel> {
    const roleCode = await this.rolesService.getDefaultRole(user);
    const role = await this.rolesService.findOrCreateByCode(roleCode);

    /**
     * If role code is admin, also assign user role to admin.
     */
    if (roleCode === RoleEnum.ADMIN) {
      const userRole = await this.rolesService.findOrCreateByCode(
        RoleEnum.USER,
      );
      await user.$add('roles', [role.id]);
      await user.$add('roles', [userRole.id]);
    } else {
      // assign only user role
      await user.$add('roles', [role.id]);
    }

    await user.reload({
      include: [RolesModel],
    });

    await user.save();

    return user;
  }
}
