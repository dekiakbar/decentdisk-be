import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('POSTGRES_APP_HOST'),
        port: configService.get('POSTGRES_APP_PORT'),
        username: configService.get('POSTGRES_APP_USER'),
        password: configService.get('POSTGRES_APP_PASSWORD'),
        database: configService.get('POSTGRES_APP_DB'),
        autoLoadModels: true,
        synchronize: configService.get('DEVELOPER_MODE') === '1' ? true : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
