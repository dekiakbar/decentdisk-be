import { Injectable, OnModuleInit } from '@nestjs/common';
import { GatewayCheckerService } from './gateway-checker.service';
import { CronService } from 'src/common/service/cron.service';

@Injectable()
export class TaskService implements OnModuleInit {
  constructor(
    private gatewayCheckerService: GatewayCheckerService,
    private cronService: CronService,
  ) {}

  onModuleInit() {
    this.cronService.addCronJob(
      `gateway_checker`,
      'GATEWAY_CHECKER_CRON',
      this.gatewayCheckerService.gatewayCheckJob.bind(
        this.gatewayCheckerService,
      ),
    );
  }
}
