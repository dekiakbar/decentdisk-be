import { ApiProperty } from '@nestjs/swagger';
import { FileResponseDto } from 'src/file/dto/file-response.dto';
import { UserResponseDto } from 'src/user/dto/user/user-response.dto';

export class AdminDashboardResponseDto {
  @ApiProperty()
  totalUser: number;
  @ApiProperty()
  totalFile: number;
  @ApiProperty()
  totalStorage: number;
  @ApiProperty()
  latestUsers: UserResponseDto[];
  @ApiProperty()
  latestFiles: FileResponseDto[];

  constructor(
    totalUser: number,
    totalFile: number,
    totalStorage: number,
    latestUsers: UserResponseDto[],
    latestFiles: FileResponseDto[],
  ) {
    this.totalUser = totalUser;
    this.totalFile = totalFile;
    this.totalStorage = totalStorage;
    this.latestUsers = latestUsers;
    this.latestFiles = latestFiles;
  }
}
