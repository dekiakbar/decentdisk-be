import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AccountProviderEnum } from 'src/auth/dto/sign-in.dto';
import { RoleEnum } from 'src/user/enum/role.enum';
import { UsersModel } from 'src/user/model/users.model';

@ApiExtraModels()
export class UserResponseDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  picture: string;

  @ApiProperty({
    enum: AccountProviderEnum,
  })
  provider: AccountProviderEnum;

  @ApiProperty()
  providerId: string;

  @ApiProperty()
  createdAt?: string;

  @ApiProperty()
  updatedAt?: string;

  @ApiProperty({
    isArray: true,
    enum: RoleEnum,
    example: Object.values(RoleEnum),
  })
  @Transform(({ value }) => value.map((v) => v.code))
  roles: RoleEnum[];

  constructor(user: UsersModel) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.picture = user.picture;
    this.provider = user.provider;
    this.providerId = user.providerId;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.roles = user.roles.map((role) => role.code as RoleEnum);
  }
}
