import { ApiProperty } from '@nestjs/swagger';
import { FileMineResponseDto } from './file-mine-response.dto';
import { UsersModel } from 'src/user/model/users.model';
import { FileModel } from '../model/files.mode';

export class FileResponseDto extends FileMineResponseDto {
  @ApiProperty()
  user: UsersModel;

  constructor(file: FileModel) {
    super(file);
    this.user = file.user;
  }
}
