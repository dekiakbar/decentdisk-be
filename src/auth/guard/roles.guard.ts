import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '../interface/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.headers['authorization']) {
      throw new UnauthorizedException();
    }

    const jwtToken = request.headers['authorization'].split(' ')[1];
    const decodedToken = this.decodeJwt(jwtToken);

    return requiredRoles.some((role) => decodedToken.roles.includes(role));
  }

  decodeJwt(jwtToken: string): JwtPayloadInterface | { [key: string]: any } {
    const decodedJwt = this.jwtService.decode(jwtToken);

    if (!decodedJwt) {
      throw new InternalServerErrorException(
        'Ops, something wrong, please try again later.',
      );
    }

    if (typeof decodedJwt !== 'object' || !('roles' in decodedJwt)) {
      throw new BadRequestException('Can not find user roles in access token.');
    }

    return decodedJwt;
  }
}
