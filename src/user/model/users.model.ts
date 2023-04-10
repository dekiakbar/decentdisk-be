import {
  BelongsToMany,
  Column,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { AccountProviderEnum } from 'src/auth/dto/sign-in.dto';
import { UserRoleModel } from './userRole.model';
import { RolesModel } from './roles.model';

@Table({
  tableName: 'users',
  underscored: true,
  timestamps: true,
})
export class UsersModel extends Model {
  @Column
  name: string;

  @Column
  @Index({ unique: true })
  email: string;

  @Column
  picture: string;

  @Column
  provider: AccountProviderEnum;

  @Column
  providerId: string;

  @BelongsToMany(() => RolesModel, () => UserRoleModel)
  roles: RolesModel[];
}
