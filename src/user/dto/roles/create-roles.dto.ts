import { IsNotEmpty } from 'class-validator';

export class CreateRolesDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  userId: number;
}
