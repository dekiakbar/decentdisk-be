import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../enum/status';
import { GatewayCheckerModel } from '../model/gateway-checker.model';

export class GatewayResponseDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  gateway: string;

  @ApiProperty()
  status: Status;

  @ApiProperty()
  latency: number;

  @ApiProperty()
  isEnabled: boolean;

  @ApiProperty()
  createdAt?: string;

  @ApiProperty()
  updatedAt?: string;

  constructor(gateway: GatewayCheckerModel) {
    this.id = gateway.id;
    this.gateway = gateway.gateway;
    this.status = gateway.status;
    this.latency = gateway.latency;
    this.isEnabled = gateway.isEnabled;
    this.createdAt = gateway.createdAt;
    this.updatedAt = gateway.updatedAt;
  }
}
