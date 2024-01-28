import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IpfsService } from 'src/ipfs/service/ipfs.service';
import { FileModel } from '../model/files.model';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from 'src/user/model/users.model';
import { UsersService } from 'src/user/service/users.service';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta-dto';
import { FileMineResponseDto } from '../dto/file-mine-response.dto';
import { FindOptions } from 'sequelize';
import { FileResponseDto } from '../dto/file-response.dto';
import { ConfigService } from '@nestjs/config';
import { FileViewResponseDto } from '../dto/file-view-response.dto';
@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileModel)
    private fileModel: typeof FileModel,
    private ipfsService: IpfsService,
    private userService: UsersService,
    private configService: ConfigService,
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
        file.internalCid = this.generateInternalCid(file.mimeType);
        return file;
      }),
    );

    const result = await this.fileModel.bulkCreate(Object.assign(userFiles));

    return result;
  }

  async getFiles(
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

    const { rows: files, count: itemCount } =
      await this.fileModel.findAndCountAll(query);
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    const filesObject = files.map((file) => {
      const filesDto: FileResponseDto = file;
      return filesDto;
    });

    return new PageDto(filesObject, pageMetaDto);
  }

  async findOne(id: number, userId: number = null): Promise<FileModel> {
    if (!id) {
      throw new BadRequestException("Id can't be empty");
    }

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

  async findOneByInternalCid(
    internalCid: string,
    userId: number = null,
  ): Promise<FileModel> {
    if (!internalCid) {
      throw new BadRequestException("InternalCid can't be empty");
    }

    const query: FindOptions = {
      where: {
        internalCid: internalCid,
      },
      include: {
        model: UsersModel,
      },
    };

    if (userId) {
      query.where = {
        internalCid: internalCid,
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
      throw new UnauthorizedException('You are not authorized.');
    }

    const file = await this.findOne(id, userId);

    return new FileMineResponseDto(file);
  }

  async remove(id: number): Promise<any> {
    try {
      const file = await this.findOne(id);
      await this.ipfsService.rm(file);
      await file.destroy();
    } catch (error: unknown) {
      /**
       * TODO: handle error
       */
      if (typeof error === 'string') {
        throw new InternalServerErrorException(error);
      } else if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async mineRemove(id: number, userId: number): Promise<any> {
    if (!userId) {
      throw new UnauthorizedException('You are not authorized.');
    }

    const file = await this.findOne(id, userId);
    await this.ipfsService.rm(file);
    await file.destroy();
  }

  /**
   * (Only use in nextJS frontend)
   * Internal CID format : base64('mimeType')-randomString
   * include mimeType in Internal CID to make frontend easy recognized the file,
   * and know which media player should be rendered.
   *
   * @param mimeType mime type, i.e: vide/mp4
   *
   * @returns {string}
   */
  generateInternalCid(mimeType: string): string {
    const separator = '-';
    const length = this.configService.get('INTERNAL_CID_LENGTH');
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    result =
      Buffer.from(mimeType).toString('base64') + separator + randomString;

    return result;
  }

  async stream(internalCid: string): Promise<FileViewResponseDto> {
    const fileData = await this.findOneByInternalCid(internalCid);
    const fileBuffer = await this.ipfsService.get(fileData.cid);
    const fileMetaData = new FileViewResponseDto(fileData, fileBuffer);

    return fileMetaData;
  }

  async mineStream(
    internalCid: string,
    userId: number,
  ): Promise<FileViewResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('You are not authorized.');
    }

    const fileData = await this.findOneByInternalCid(internalCid, userId);
    const fileBuffer = await this.ipfsService.get(fileData.cid);
    const fileMetaData = new FileViewResponseDto(fileData, fileBuffer);

    return fileMetaData;
  }
}
