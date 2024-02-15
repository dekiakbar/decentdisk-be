import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GatewayCheckerService } from '../service/gateway-checker.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateGatewayDto } from '../dto/create-gateway.dto';
import { GatewayCheckerModel } from '../model/gateway-checker.model';
import { UpdateGatewayDto } from '../dto/update-gateway.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { ApiSuccessResponse } from 'src/common/decorator/api-success-response';
import { GatewayResponseDto } from '../dto/gateway-response.dto';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginated-response.decoratos';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';

@ApiResponse({ status: 401, description: 'Unauthorized.' })
@ApiResponse({ status: 403, description: 'Forbidden.' })
@UseGuards(AuthGuard('jwt'))
@Roles(RoleEnum.ADMIN)
@ApiTags('Gateway Checker')
@ApiBearerAuth('Bearer')
@Controller('admin/gateway-checker')
export class GatewayCheckerController {
  constructor(private gatewayService: GatewayCheckerService) {}

  @ApiPaginatedResponse(GatewayResponseDto)
  @Get()
  async getGateways(
    @Param() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<GatewayResponseDto>> {
    return await this.gatewayService.getGateways(pageOptionsDto);
  }

  @ApiSuccessResponse(GatewayResponseDto, 'Successfully add Gateway')
  @Post()
  async add(@Body() createDto: CreateGatewayDto) {
    return await this.gatewayService.add(createDto);
  }

  @ApiSuccessResponse(GatewayResponseDto, 'Successfully update Gateway')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateGatewayDto,
  ): Promise<GatewayCheckerModel> {
    return await this.gatewayService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gatewayService.remove(+id);
  }
}
