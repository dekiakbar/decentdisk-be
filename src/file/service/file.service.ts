import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IpfsService } from 'src/ipfs/service/ipfs.service';
import { FileModel } from '../model/files.mode';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from 'src/user/model/users.model';
import { UsersService } from 'src/user/service/users.service';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta-dto';
import { FileMineResponseDto } from '../dto/file-mine-response.dto';
import { FindOptions } from 'sequelize';
import { FileResponseDto } from '../dto/file-response.dto';
@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileModel)
    private fileModel: typeof FileModel,
    private ipfsService: IpfsService,
    private userService: UsersService,
  ) {}

  async upload(
    files: Array<Express.Multer.File>,
    userId: number,
  ): Promise<FileModel[]> {
    const user = await this.userService.findOne(userId);
    const fileDatas = await this.addUserFiles(files, user);

    return fileDatas;
  }

  async addUserFiles(
    files: Array<Express.Multer.File>,
    user: UsersModel,
  ): Promise<FileModel[]> {
    const ipfsFiles = await this.ipfsService.addAll(files);
    const userFiles = await Promise.all(
      ipfsFiles.map(async (file) => {
        file.userId = user.id;
        return file;
      }),
    );

    const result = await this.fileModel.bulkCreate(Object.assign(userFiles));

    return result;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    userId: number = null,
  ): Promise<PageDto<FileResponseDto>> {
    const query: FindOptions = {
      limit: pageOptionsDto.limit,
      offset: pageOptionsDto.offset,
      order: [['createdAt', pageOptionsDto.order]],
    };

    if (userId) {
      query.where = {
        userId: userId,
      };
    }

    const files = await this.fileModel.findAll(query);

    const itemCount = files.length;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    const filesObject = files.map((file) => {
      const filesDto: FileResponseDto = file;
      return filesDto;
    });

    return new PageDto(filesObject, pageMetaDto);
  }

  async findOne(id: number, userId: number = null): Promise<FileModel> {
    const query: FindOptions = {
      where: {
        id: id,
      },
      include: {
        model: UsersModel,
      },
    };

    if (userId) {
      query.where = {
        id: id,
        userId: userId,
      };
    }

    const file = await this.fileModel.findOne(query);

    if (!file) {
      throw new NotFoundException('File is not exist');
    }

    return file;
  }

  async detail(id: number): Promise<FileResponseDto> {
    const file = await this.findOne(id);
    return new FileResponseDto(file);
  }

  async mineDetail(id: number, userId: number): Promise<FileMineResponseDto> {
    if (!userId) {
      throw new BadRequestException('you are not authorized.');
    }

    const file = await this.findOne(id, userId);

    return new FileMineResponseDto(file);
  }

  async remove(id: number): Promise<any> {
    const file = await this.findOne(id);
    const result = await this.ipfsService.rm(file.cid);
    if (result) {
      await file.destroy();
    }
  }

  async mineRemove(id: number, userId: number): Promise<any> {
    if (!userId) {
      throw new BadRequestException('you are not authorized.');
    }

    const file = await this.findOne(id, userId);
    const result = await this.ipfsService.rm(file.cid);
    if (result) {
      await file.destroy();
    }
  }
}
