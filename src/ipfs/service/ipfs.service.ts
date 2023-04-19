import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CID, IPFSHTTPClient } from 'ipfs-http-client';
import { IpfsAddResultDto } from '../dto/ipfs-add-result.dto';
@Injectable()
export class IpfsService {
  constructor(@Inject('IPFS') private ipfs: IPFSHTTPClient) {}

  async addAll(files: Array<Express.Multer.File>): Promise<IpfsAddResultDto[]> {
    if (!files) {
      throw new BadRequestException("File can't be empty.");
    }

    const result = await Promise.all(
      files.map(async (file): Promise<IpfsAddResultDto> => {
        /**
         * Random chunk size to prevent same file cid on same file.
         */
        const chunk = this.getRandomChunk();
        const addResult = await this.ipfs.add(file.buffer, {
          chunker: chunk,
        });
        const response = new IpfsAddResultDto(file, addResult.path);

        return response;
      }),
    );

    return result;
  }

  getRandomChunk(): string {
    const prefix = 'size-';
    const min = 1;
    const max = 3000;
    const size = Math.floor(Math.random() * (max - min + 1)) + min;
    return prefix + size.toString();
  }

  async rm(cid: string): Promise<CID> {
    const result = await this.ipfs.pin.rm(cid);
    return result;
  }
}
