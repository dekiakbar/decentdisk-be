import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesModel } from '../model/roles.model';
import { ConfigService } from '@nestjs/config';
import { RoleEnum } from '../enum/role.enum';
import { UsersModel } from '../model/users.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RolesModel)
    private readonly rolesModel: typeof RolesModel,
    private readonly configService: ConfigService,
  ) {}

  async getConfigAdminEmail(): Promise<string[] | null> {
    const configAdminEmails = await this.configService.get('ADMIN_EMAIL');
    if (!configAdminEmails) {
      return null;
    }

    return configAdminEmails.split(',');
  }

  async findOrCreateByCode(roleCode: RoleEnum): Promise<RolesModel> {
    const result = await this.rolesModel.findOrCreate({
      where: {
        code: roleCode,
      },
    });

    if (!result) {
      throw new InternalServerErrorException(
        'Something wrong, please try again later.',
      );
    }

    return result[0];
  }

  async getDefaultRole(user: UsersModel): Promise<RoleEnum> {
    const adminEmails = await this.getConfigAdminEmail();

    if (!adminEmails) {
      return RoleEnum.USER;
    }

    if (adminEmails.includes(user.email)) {
      return RoleEnum.ADMIN;
    }

    return RoleEnum.USER;
  }
}
