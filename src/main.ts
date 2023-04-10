import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SetupSwagger } from './common/util/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (process.env.ENABLE_SWAGGER == '1') {
    SetupSwagger(app);
  }

  if (process.env.ENABLE_CORS == '1') {
    app.enableCors();
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
