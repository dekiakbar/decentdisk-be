import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './service/users.service';
import { UsersModel } from './model/users.model';
import { UsersController } from './controller/users.controller';
import { RolesModel } from './model/roles.model';
import { RolesService } from './service/roles.service';
import { UserRoleModel } from './model/userRole.model';
@Module({
  imports: [
    DatabaseModule,
    SequelizeModule.forFeature([UsersModel, RolesModel, UserRoleModel]),
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
