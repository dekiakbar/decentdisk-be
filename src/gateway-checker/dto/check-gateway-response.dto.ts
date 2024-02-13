import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../enum/status';

export class CheckGatewayResponseDto {
  @ApiProperty()
  status: Status;

  @ApiProperty()
  latency: number;

  constructor(status: Status, latency: number) {
    this.status = status;
    this.latency = latency;
  }
}
