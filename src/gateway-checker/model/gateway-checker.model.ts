import {
  Column,
  DataType,
  Default,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript';
import { Status } from '../enum/status';

@Table({
  tableName: 'gateway_checker',
  underscored: true,
  timestamps: true,
})
export class GatewayCheckerModel extends Model {
  @NotEmpty
  @Column
  gateway: string;

  @Column
  status: Status;

  @Column({ type: DataType.DOUBLE })
  latency: number;

  @Default(true)
  @Column
  isEnabled: boolean;
}
