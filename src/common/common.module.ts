import { Module } from '@nestjs/common';
import { CronService } from './service/cron.service';

@Module({
  providers: [CronService],
  exports: [CronService],
})
export class CommonModule {}
