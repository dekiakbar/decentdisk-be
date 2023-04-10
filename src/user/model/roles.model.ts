import {
  BelongsToMany,
  Column,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { RoleEnum } from '../enum/role.enum';
import { UsersModel } from './users.model';
import { UserRoleModel } from './userRole.model';

@Table({
  tableName: 'roles',
  underscored: true,
  timestamps: true,
})
export class RolesModel extends Model {
  @Column
  @Index({ unique: true })
  code: RoleEnum;

  @Column({ allowNull: true })
  description: string | null;

  @BelongsToMany(() => UsersModel, () => UserRoleModel)
  users: UsersModel[];
}
