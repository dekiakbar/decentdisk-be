import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   *  Adds a dynamic cron job.
   *
   * @param name - cron job name.
   * @param cronExpressionEnv - a env var for cron expression.
   * @param callback - actual function that will handle the actual job.
   */
  addCronJob(
    name: string,
    cronExpressionEnv: string,
    callback: () => Promise<void>,
  ) {
    const gatewayCheckerExpression = this.configService.get(cronExpressionEnv);

    const job = new CronJob(gatewayCheckerExpression, async () => {
      callback();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.log(
      `The cron job ${name} has been added with the following cron expression : ${this.configService.get(
        cronExpressionEnv,
      )}.`,
    );
  }
}
