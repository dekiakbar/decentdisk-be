import { ApiProperty } from '@nestjs/swagger';
import { FileModel } from '../model/files.mode';

export class FileMineResponseDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  cid: string;

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

  constructor(file: FileModel) {
    this.id = file.id;
    this.userId = file.userId;
    this.cid = file.cid;
    this.name = file.name;
    this.size = file.size;
    this.mimeType = file.mimeType;
    this.createdAt = file.createdAt;
    this.updatedAt = file.updatedAt;
  }
}
