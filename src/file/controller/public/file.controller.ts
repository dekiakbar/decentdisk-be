import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { FileService } from 'src/file/service/file.service';
import { Stream } from 'stream';
import { Response } from 'express';

@Controller('view')
export class FileController {
  constructor(private fileService: FileService) {}
  @Get(':internalCid')
  async stream(
    @Param('internalCid') internalCid: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileMetaData = await this.fileService.stream(internalCid);
    const file = Stream.Readable.from(fileMetaData.buffer);

    res.set({
      'Content-Type': fileMetaData.mimeType,
      'Content-Length': fileMetaData.size,
      'Accept-Ranges': 'bytes',
      'Content-Disposition': `filename="${fileMetaData.name}"`,
      'File-Name': fileMetaData.name
    });

    return new StreamableFile(file);
  }
}
