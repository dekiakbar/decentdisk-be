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
} from '@nestjs/common';
import { FileService } from '../service/file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginated-response.decoratos';
import { FileResponseDto } from '../dto/file-response.dto';
import { FileMineResponseDto } from '../dto/file-mine-response.dto';
import { ApiSuccessResponse } from 'src/common/decorator/api-success-response';
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

  @ApiPaginatedResponse(FileResponseDto)
  @Roles(RoleEnum.ADMIN)
  @Get()
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.fileService.findAll(pageOptionsDto);
  }

  @ApiPaginatedResponse(FileMineResponseDto)
  @Get('mine')
  mine(@Query() pageOptionsDto: PageOptionsDto, @Request() request) {
    return this.fileService.findAll(pageOptionsDto, request.user.id);
  }

  @ApiSuccessResponse(FileResponseDto, 'Successfully received file detail')
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.fileService.detail(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }

  @ApiSuccessResponse(FileMineResponseDto, 'Successfully received file detail')
  @Get('mine/:id')
  mineDetail(@Param('id') id: string, @Request() request) {
    return this.fileService.mineDetail(+id, request.user.id);
  }

  @Delete('mine/:id')
  mineRemove(@Param('id') id: string, @Request() request) {
    return this.fileService.mineRemove(+id, request.user.id);
  }
}
