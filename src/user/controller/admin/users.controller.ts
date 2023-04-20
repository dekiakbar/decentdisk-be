import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginated-response.decoratos';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UpdateUserDto } from 'src/user/dto/user/update-user.dto';
import { UsersService } from 'src/user/service/users.service';
import { UserResponseDto } from 'src/user/dto/user/user-response.dto';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiSuccessResponse } from 'src/common/decorator/api-success-response';
@ApiTags('User')
@ApiBearerAuth('Bearer')
@UseGuards(AuthGuard('jwt'))
@Controller('admin/user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiPaginatedResponse(UserResponseDto)
  @Roles(RoleEnum.ADMIN)
  @Get()
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserResponseDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @ApiSuccessResponse(UserResponseDto, 'Successfully received user data')
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  getDetail(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getDetail(+id);
  }

  @ApiSuccessResponse(UserResponseDto, 'Successfully update user data')
  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOkResponse()
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
