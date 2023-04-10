import { RoleEnum } from 'src/user/enum/role.enum';

export interface JwtPayloadInterface {
  id: number;
  name: string;
  roles: RoleEnum[];
  iat?: string | null;
  exp?: string | null;
}
