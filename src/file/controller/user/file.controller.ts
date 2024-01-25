import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginated-response.decoratos';
import { FileService } from 'src/file/service/file.service';
import { FileResponseDto } from 'src/file/dto/file-response.dto';
import { FileMineResponseDto } from 'src/file/dto/file-mine-response.dto';
import { ApiSuccessResponse } from 'src/common/decorator/api-success-response';
import { Stream } from 'stream';
import { Response } from 'express';

@UseGuards(AuthGuard('jwt'))
@ApiTags('File')
@ApiBearerAuth('Bearer')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiSuccessResponse(FileResponseDto, 'Successfully upload file')
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() request,
  ) {
    return await this.fileService.upload(files, request.user.id);
  }

  @ApiPaginatedResponse(FileMineResponseDto)
  @Get()
  mine(@Query() pageOptionsDto: PageOptionsDto, @Request() request) {
    return this.fileService.getFiles(pageOptionsDto, request.user.id);
  }

  @ApiSuccessResponse(FileMineResponseDto, 'Successfully received file detail')
  @Get(':id')
  mineDetail(@Param('id') id: string, @Request() request) {
    return this.fileService.mineDetail(+id, request.user.id);
  }

  @Delete(':id')
  mineRemove(@Param('id') id: string, @Request() request) {
    return this.fileService.mineRemove(+id, request.user.id);
  }

  @Get('stream/:internalCid')
  async stream(
    @Param('internalCid') internalCid: string,
    @Res({ passthrough: true }) res: Response,
    @Request() request,
  ): Promise<StreamableFile> {
    const fileMetaData = await this.fileService.mineStream(
      internalCid,
      request.user.id,
    );
    const file = Stream.Readable.from(fileMetaData.buffer);

    res.set({
      'Content-Type': fileMetaData.mimeType,
    });

    return new StreamableFile(file);
  }
}
