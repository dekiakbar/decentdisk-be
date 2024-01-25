import { Module } from '@nestjs/common';
import { DashboardController } from './controller/admin/dashboard.controller';
import { DashboardService } from './service/dashboard.service';
import { UsersModule } from 'src/user/users.module';
import { FileModule } from 'src/file/file.module';
import { IpfsModule } from 'src/ipfs/ipfs.module';

@Module({
  imports: [UsersModule, FileModule, IpfsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
