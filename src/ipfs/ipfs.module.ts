import { Module } from '@nestjs/common';
import { IpfsService } from './service/ipfs.service';
import { IpfsProvider } from './provider/ipfs.provider.ts';

@Module({
  providers: [IpfsService, IpfsProvider],
  exports: [IpfsService],
})
export class IpfsModule {}
