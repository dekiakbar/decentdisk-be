import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UsersModel } from './users.model';
import { RolesModel } from './roles.model';
@Table({
  tableName: 'users_roles',
  underscored: true,
  timestamps: true,
})
export class UserRoleModel extends Model {
  @ForeignKey(() => UsersModel)
  @Column
  userId: number;

  @ForeignKey(() => RolesModel)
  @Column
  roleId: number;
}
