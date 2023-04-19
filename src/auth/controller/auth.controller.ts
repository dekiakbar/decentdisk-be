import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/user/service/users.service';
import { UserResponseDto } from 'src/user/dto/user/user-response.dto';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/decorator/api-success-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/signin')
  create(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @ApiSuccessResponse(UserResponseDto, 'Successfully received user data')
  @ApiBearerAuth('Bearer')
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getDetail(@Request() req): Promise<UserResponseDto> {
    return this.userService.getDetail(req.user.id);
  }
}
