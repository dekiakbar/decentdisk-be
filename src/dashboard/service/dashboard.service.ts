import { Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { Order } from 'src/common/enum/order.enum';
import { FileService } from 'src/file/service/file.service';
import { UsersService } from 'src/user/service/users.service';
import { AdminDashboardResponseDto } from '../dto/admin-dashboard-response.dto';
import { IpfsService } from 'src/ipfs/service/ipfs.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userService: UsersService,
    private readonly fileSevice: FileService,
    private readonly ipfsService: IpfsService,
  ) {}

  async getAdminDashboardData(): Promise<AdminDashboardResponseDto> {
    const pageOptions: PageOptionsDto = {
      order: Order.DESC,
      page: 1,
      limit: 5,
      offset: 0,
    };
    const users = await this.userService.getUsers(pageOptions);
    const files = await this.fileSevice.getFiles(pageOptions);
    const stat = await this.ipfsService.getStat();

    const response = new AdminDashboardResponseDto(
      users.meta.itemCount,
      files.meta.itemCount,
      Number(stat.repoSize),
      users.data,
      files.data,
    );
    return response;
  }
}
