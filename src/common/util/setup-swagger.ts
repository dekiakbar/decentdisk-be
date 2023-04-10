import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function SetupSwagger(app: INestApplication): void {
  const oprions = new DocumentBuilder()
    .setTitle('NestJs Auth')
    .setDescription('NestJs backend for nextauth')
    .addBearerAuth(
      {
        type: 'http',
        schema: 'Bearer',
        bearerFormat: 'Token',
      } as SecuritySchemeObject,
      'Bearer',
    )
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, oprions);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
