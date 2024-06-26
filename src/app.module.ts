import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { CommonModule } from './common/common.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { FileModule } from './file/file.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { GatewayCheckerModule } from './gateway-checker/gateway-checker.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { CronService } from './commom/service/cron.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CommonModule,
    IpfsModule,
    FileModule,
    DashboardModule,
    ScheduleModule.forRoot(),
    GatewayCheckerModule,
  ],
  // providers: [CronService],
})
export class AppModule {}
