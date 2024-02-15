import { ApiProperty } from '@nestjs/swagger';
import { FileModel } from '../model/files.model';
import { GatewayResponseDto } from 'src/gateway-checker/dto/gateway-response.dto';

export class FileMineResponseDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  internalCid: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  createdAt?: string;

  @ApiProperty()
  updatedAt?: string;

  @ApiProperty()
  gateways: string[] = [];

  constructor(file: FileModel, gateways: GatewayResponseDto[]) {
    this.id = file.id;
    this.userId = file.userId;
    this.internalCid = file.internalCid;
    this.name = file.name;
    this.size = file.size;
    this.mimeType = file.mimeType;
    this.createdAt = file.createdAt;
    this.updatedAt = file.updatedAt;

    gateways.map((gateway) => {
      const url = `${gateway.gateway}/${file.cid}`;
      this.gateways.push(url);
    });
  }
}
