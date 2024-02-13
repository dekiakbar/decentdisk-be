import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Status } from '../enum/status';
import { PartialType } from '@nestjs/mapped-types';
import { CreateGatewayDto } from './create-gateway.dto';

export class UpdateGatewayDto extends PartialType(CreateGatewayDto) {
  @ApiProperty()
  @IsOptional()
  status?: Status;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  latency?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
