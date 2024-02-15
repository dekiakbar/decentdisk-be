import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GatewayCheckerModel } from './model/gateway-checker.model';
import { DatabaseModule } from 'src/database/database.module';
import { GatewayCheckerService } from './service/gateway-checker.service';
import { GatewayCheckerController } from './controller/gateway-checker.controller';
import { TaskService } from './service/task.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    DatabaseModule,
    SequelizeModule.forFeature([GatewayCheckerModel]),
    CommonModule,
  ],
  providers: [GatewayCheckerService, TaskService],
  controllers: [GatewayCheckerController],
  exports: [GatewayCheckerService],
})
export class GatewayCheckerModule {}
