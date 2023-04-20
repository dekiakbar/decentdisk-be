import { Module } from '@nestjs/common';
import { FileService } from './service/file.service';
import { FileController as UserFileController } from './controller/user/file.controller';
import { IpfsModule } from 'src/ipfs/ipfs.module';
import { DatabaseModule } from 'src/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModel } from './model/files.model';
import { UsersModule } from 'src/user/users.module';
import { FileController as AdminFileController } from './controller/admin/file.controller';

@Module({
  imports: [
    IpfsModule,
    DatabaseModule,
    SequelizeModule.forFeature([FileModel]),
    UsersModule,
  ],
  controllers: [AdminFileController, UserFileController],
  providers: [FileService],
})
export class FileModule {}
