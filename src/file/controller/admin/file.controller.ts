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
  StreamableFile,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginated-response.decoratos';
import { FileService } from 'src/file/service/file.service';
import { FileResponseDto } from 'src/file/dto/file-response.dto';
import { ApiSuccessResponse } from 'src/common/decorator/api-success-response';
import { Stream } from 'stream';
import { Response } from 'express';

@UseGuards(AuthGuard('jwt'))
@ApiTags('File')
@ApiBearerAuth('Bearer')
@Controller('admin/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiSuccessResponse(FileResponseDto, 'Successfully upload file')
  @Roles(RoleEnum.ADMIN)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() request,
  ) {
    return await this.fileService.upload(files, request.user.id);
  }

  @ApiPaginatedResponse(FileResponseDto)
  @Roles(RoleEnum.ADMIN)
  @Get()
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.fileService.findAll(pageOptionsDto);
  }

  @ApiSuccessResponse(FileResponseDto, 'Successfully received file detail')
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.fileService.detail(+id);
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }

  @Get('stream/:internalCid')
  @Roles(RoleEnum.ADMIN)
  async stream(
    @Param('internalCid') internalCid: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileMetaData = await this.fileService.stream(internalCid);
    const file = Stream.Readable.from(fileMetaData.buffer);

    res.set({
      'Content-Type': fileMetaData.mimeType,
    });

    return new StreamableFile(file);
  }
}
