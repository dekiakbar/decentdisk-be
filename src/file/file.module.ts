import { Module } from '@nestjs/common';
import { FileService } from './service/file.service';
import { FileController } from './controller/file.controller';
import { IpfsModule } from 'src/ipfs/ipfs.module';
import { DatabaseModule } from 'src/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModel } from './model/files.mode';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports: [
    IpfsModule,
    DatabaseModule,
    SequelizeModule.forFeature([FileModel]),
    UsersModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
