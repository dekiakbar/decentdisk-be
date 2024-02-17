import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GatewayCheckerModel } from '../model/gateway-checker.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGatewayDto } from '../dto/create-gateway.dto';
import { CheckGatewayResponseDto } from '../dto/check-gateway-response.dto';
import { Status } from '../enum/status';
import { UpdateGatewayDto } from '../dto/update-gateway.dto';
import { ConfigService } from '@nestjs/config';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from 'src/common/dto/page-meta-dto';
import { PageDto } from 'src/common/dto/page.dto';
import { GatewayResponseDto } from '../dto/gateway-response.dto';
import { Order } from 'src/common/enum/order.enum';

@Injectable()
export class GatewayCheckerService {
  private readonly logger = new Logger(GatewayCheckerService.name);
  constructor(
    @InjectModel(GatewayCheckerModel)
    private gateWayCheckerModel: typeof GatewayCheckerModel,
    private configService: ConfigService,
  ) {}

  /**
   * Check gateway and update the gateways database.
   */
  async gatewayCheckJob() {
    this.logger.log(`Start check gateways`);
    const enabledgateway = await this.getEnabledGateway();
    enabledgateway.map(async (gateway) => {
      const cid = await this.configService.get('GATEWAY_CHECKER_CID');
      const fileCheckUrl = `${gateway.gateway}/${cid}`;
      const result = await this.checkGateway(fileCheckUrl);
      await gateway.update({
        latency: result.latency,
        status: result.status,
      });
    });
  }

  async add(gatewayCheckerDto: CreateGatewayDto): Promise<GatewayCheckerModel> {
    try {
      const gatewayChecker = await this.gateWayCheckerModel.create({
        gateway: gatewayCheckerDto.gateway,
        isEnabled: gatewayCheckerDto.isEnabled,
      });

      return gatewayChecker;
    } catch (error) {
      /**
       * TODO: Handle all error type
       */
      if (error.name === 'SequelizeUniqueConstraintError') {
        // Handle unique constraint errors
        const errorMessage = `${error.errors[0].message}: ${error.errors[0].path}`;
        throw new BadRequestException(errorMessage);
      } else {
        // Handle other types of errors
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async getGateways(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<GatewayResponseDto>> {
    const { rows: gateways, count: itemCount } =
      await this.gateWayCheckerModel.findAndCountAll({
        limit: pageOptionsDto.limit,
        offset: pageOptionsDto.offset,
        order: [['createdAt', pageOptionsDto.order]],
      });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    const gatewaysResponse = gateways.map((gateway) => {
      return new GatewayResponseDto(gateway);
    });

    return new PageDto(gatewaysResponse, pageMetaDto);
  }

  async findOne(id: number): Promise<GatewayCheckerModel> {
    if (!id) {
      throw new BadRequestException("Id can't be empty");
    }

    const gatewayChecker = await this.gateWayCheckerModel.findOne({
      where: {
        id: id,
      },
    });

    if (!gatewayChecker) {
      throw new BadRequestException('Data not found');
    }

    return gatewayChecker;
  }

  async checkGateway(gateway: string): Promise<CheckGatewayResponseDto> {
    const startTime = performance.now();

    try {
      const response = await fetch(gateway);
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;

      if (response.ok) {
        return new CheckGatewayResponseDto(Status.ONLINE, elapsedTime);
      }

      return new CheckGatewayResponseDto(Status.OFFLINE, null);
    } catch (error) {
      return new CheckGatewayResponseDto(Status.OFFLINE, null);
    }
  }

  async getEnabledGateway(): Promise<GatewayCheckerModel[]> {
    const enabledGateway = await this.gateWayCheckerModel.findAll({
      where: {
        isEnabled: true,
      },
    });

    return enabledGateway;
  }

  async update(
    id: number,
    updateGateway: UpdateGatewayDto,
  ): Promise<GatewayCheckerModel> {
    const gateway = await this.findOne(id);
    const result = await gateway.update(updateGateway);
    return result;
  }

  async remove(id: number) {
    const gateway = await this.findOne(id);
    await gateway.destroy();
  }

  async getSortedByLatency(): Promise<GatewayResponseDto[]> {
    const gateways = await this.gateWayCheckerModel.findAll({
      order: [['latency', Order.ASC]],
      where: {
        status: Status.ONLINE,
        isEnabled: true,
      },
    });

    return gateways;
  }
}
