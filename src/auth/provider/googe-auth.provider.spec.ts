import { Test, TestingModule } from '@nestjs/testing';
import { GoogeAuth } from './googe-auth.provider';

describe('GoogeAuth', () => {
  let provider: GoogeAuth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogeAuth],
    }).compile();

    provider = module.get<GoogeAuth>(GoogeAuth);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
