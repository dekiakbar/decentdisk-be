import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsString,
} from 'class-validator';

export class CreateGatewayDto {
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  @IsString()
  gateway: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isEnabled: boolean;
}
