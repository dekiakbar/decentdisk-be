import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string | null;
  @ApiProperty()
  readonly email: string | null;
  @ApiProperty()
  readonly image: string | null;
}

export enum ProviderTypeEnum {
  OAUTH = 'oauth',
  EMAIL = 'email',
  CREDENTIALS = 'credentials',
}

export enum AccountProviderEnum {
  GOOGLE = 'google',
}

export class SignInAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly providerAccountId: string;

  @IsEnum(AccountProviderEnum)
  @ApiProperty()
  readonly provider: string;

  @IsEnum(ProviderTypeEnum)
  @ApiProperty()
  readonly type: ProviderTypeEnum;

  @ApiProperty()
  readonly userId: string | null;
  @ApiProperty()
  readonly access_token: string | null;
  @ApiProperty()
  readonly token_type: string | null;
  @ApiProperty()
  readonly id_token: string | null;
  @ApiProperty()
  readonly refresh_token: string | null;
  @ApiProperty()
  readonly scope: string | null;
  @ApiProperty()
  readonly expires_at: number;
  @ApiProperty()
  readonly session_state: string | null;
}

export class SignInDto {
  @ApiProperty()
  @Type(() => SignInUserDto)
  @ValidateNested()
  readonly user: SignInUserDto;

  @ApiProperty()
  @Type(() => SignInAccountDto)
  @ValidateNested()
  readonly account: SignInAccountDto;
}
