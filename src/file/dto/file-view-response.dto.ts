import { ApiProperty } from '@nestjs/swagger';
import { FileMineResponseDto } from './file-mine-response.dto';
import { FileModel } from '../model/files.model';
import { GatewayResponseDto } from 'src/gateway-checker/dto/gateway-response.dto';

export class FileViewResponseDto extends FileMineResponseDto {
  @ApiProperty()
  buffer: Buffer;

  constructor(file: FileModel, buffer: Buffer, gateways: GatewayResponseDto[]) {
    super(file, gateways);
    this.buffer = buffer;
  }
}
