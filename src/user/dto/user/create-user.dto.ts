import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { AccountProviderEnum } from 'src/auth/dto/sign-in.dto';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  picture: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AccountProviderEnum)
  provider: string;

  @ApiProperty()
  @IsNotEmpty()
  providerId: string;
}
