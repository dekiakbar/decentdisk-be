import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UsersService } from '../service/users.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user/user-response.dto';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginated-response.decoratos';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RoleEnum } from '../enum/role.enum';
import { ApiSuccessResponse } from 'src/common/decorator/api-success-response';
@ApiTags('User')
@ApiBearerAuth('Bearer')
@UseGuards(AuthGuard('jwt'))
@Roles(RoleEnum.ADMIN)
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiPaginatedResponse(UserResponseDto)
  @Get()
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserResponseDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @ApiSuccessResponse(UserResponseDto, 'Successfully received user data')
  @Get(':id')
  getDetail(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getDetail(+id);
  }

  @ApiSuccessResponse(UserResponseDto, 'Successfully update user data')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
