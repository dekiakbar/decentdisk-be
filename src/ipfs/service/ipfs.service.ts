import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IPFSHTTPClient } from 'ipfs-http-client';
import { IpfsAddResultDto } from '../dto/ipfs-add-result.dto';
import { FileModel } from 'src/file/model/files.model';
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
         * Add random string to file name
         */
        file.originalname = this.appendToFilename(
          file.originalname,
          Date.now(),
        );

        /**
         * Random chunk size to prevent same file cid on same file.
         */
        const chunk = this.getRandomChunk();
        const result = await this.ipfs.add(file.buffer, {
          chunker: chunk,
        });

        await this.ipfs.files.cp(
          '/ipfs/' + result.cid,
          '/' + file.originalname,
        );
        await this.ipfs.pin.add(result.cid, { recursive: true });
        const response = new IpfsAddResultDto(file, result.path);

        return response;
      }),
    );

    return result;
  }

  getRandomChunk(): string {
    const prefix = 'size-';
    /**
     * If min is low, upload speed will slowly
     */
    const min = 524288; // default: size-262144
    const max = 786432;
    const size = Math.floor(Math.random() * (max - min)) + min;
    return prefix + size.toString();
  }

  async rm(file: FileModel): Promise<void> {
    const isFilePinned = await this.isPinned(file.cid);

    if (isFilePinned) {
      await this.ipfs.pin.rm(file.cid);
    }

    const result = await this.ipfs.files.rm('/' + file.name);

    return result;
  }

  async get(cid: string): Promise<Buffer> {
    const dataStream = this.ipfs.cat(cid);
    const chunks = [];
    for await (const chunk of dataStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return buffer;
  }

  async isPinned(fileCid: string): Promise<boolean> {
    for await (const { cid } of this.ipfs.pin.ls({ type: 'recursive' })) {
      if (fileCid == cid.toString()) return true;
    }
    return false;
  }

  appendToFilename(filename: string, string: string | number): string {
    const prefix = '-';
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex == -1) {
      return filename + prefix + string;
    } else {
      return (
        filename.substring(0, dotIndex) +
        prefix +
        string +
        filename.substring(dotIndex)
      );
    }
  }
}
