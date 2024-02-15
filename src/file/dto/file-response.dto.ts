import { ApiProperty } from '@nestjs/swagger';
import { FileMineResponseDto } from './file-mine-response.dto';
import { UsersModel } from 'src/user/model/users.model';
import { FileModel } from '../model/files.model';
import { GatewayResponseDto } from 'src/gateway-checker/dto/gateway-response.dto';

export class FileResponseDto extends FileMineResponseDto {
  @ApiProperty()
  user: UsersModel;

  @ApiProperty()
  cid: string;

  constructor(file: FileModel, gateways: GatewayResponseDto[]) {
    super(file, gateways);
    this.user = file.user;
    this.cid = file.cid;
  }
}
