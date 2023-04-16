import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UsersModel } from 'src/user/model/users.model';

@Table({
  tableName: 'files',
  underscored: true,
  timestamps: true,
})
export class FileModel extends Model {
  @ForeignKey(() => UsersModel)
  @Column
  userId: number;

  @Column
  cid: string;

  @Column
  name: string;

  @Column
  size: number;

  @Column
  mimeType: string;

  @BelongsTo(() => UsersModel)
  user: UsersModel;
}
