import { Test, TestingModule } from '@nestjs/testing';
import { IpfsProviderTs } from './ipfs.provider.ts';

describe('IpfsProviderTs', () => {
  let provider: IpfsProviderTs;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpfsProviderTs],
    }).compile();

    provider = module.get<IpfsProviderTs>(IpfsProviderTs);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
