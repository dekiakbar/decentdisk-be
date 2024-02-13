import { Test, TestingModule } from '@nestjs/testing';
import { GatewayCheckerService } from './gateway-checker.service';

describe('GatewayCheckerService', () => {
  let service: GatewayCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatewayCheckerService],
    }).compile();

    service = module.get<GatewayCheckerService>(GatewayCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
