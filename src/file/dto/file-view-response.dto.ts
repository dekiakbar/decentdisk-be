import { ApiProperty } from '@nestjs/swagger';
import { FileMineResponseDto } from './file-mine-response.dto';
import { FileModel } from '../model/files.model';

export class FileViewResponseDto extends FileMineResponseDto {
  @ApiProperty()
  buffer: Buffer;

  constructor(file: FileModel, buffer: Buffer) {
    super(file);
    this.buffer = buffer;
  }
}
