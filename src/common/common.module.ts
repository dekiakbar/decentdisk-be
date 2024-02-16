import { Module } from '@nestjs/common';
import { CronService } from './service/cron.service';
import { HelperService } from './service/helper.service';

@Module({
  providers: [CronService, HelperService],
  exports: [CronService, HelperService],
})
export class CommonModule {}
