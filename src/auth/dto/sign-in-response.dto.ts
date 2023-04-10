import { PartialType } from '@nestjs/mapped-types';
import { UsersModel } from '../../user/model/users.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserResponseDto } from 'src/user/dto/user/user-response.dto';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';
export class SignInResponseDto extends PartialType(UserResponseDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  constructor(user: UsersModel, accessToken: string) {
    super(user);
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.picture = user.picture;
    this.provider = user.provider;
    this.providerId = user.providerId;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.roles = user.roles.map((role) => role.code as RoleEnum);
    this.accessToken = accessToken;
  }
}
