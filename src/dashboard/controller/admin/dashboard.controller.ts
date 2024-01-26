import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { AdminDashboardResponse } from 'src/dashboard/decorator/admin-dashboard-response.decorator';
import { AdminDashboardResponseDto } from 'src/dashboard/dto/admin-dashboard-response.dto';
import { DashboardService } from 'src/dashboard/service/dashboard.service';
import { RoleEnum } from 'src/user/enum/role.enum';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Dashboard')
@ApiBearerAuth('Bearer')
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @AdminDashboardResponse()
  @Roles(RoleEnum.ADMIN)
  @Get()
  async getDashboardData(): Promise<AdminDashboardResponseDto> {
    return await this.dashboardService.getAdminDashboardData();
  }
}
