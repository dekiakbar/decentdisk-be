import { Test, TestingModule } from '@nestjs/testing';
import { GatewayCheckerController } from './gateway-checker.controller';

describe('GatewayCheckerController', () => {
  let controller: GatewayCheckerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayCheckerController],
    }).compile();

    controller = module.get<GatewayCheckerController>(GatewayCheckerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
