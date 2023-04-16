import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { create } from 'ipfs-http-client';

export const IpfsProvider: Provider = {
  provide: 'IPFS',
  useFactory: async (configService: ConfigService) => {
    const ipfsClient = create({
      host: configService.get('IPFS_HOST'),
      port: configService.get('IPFS_RPC_API_PORT'),
    });
    return ipfsClient;
  },
  inject: [ConfigService],
};
