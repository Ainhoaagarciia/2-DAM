import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';   //  npm install --save @nestjs/swagger swagger-ui-express

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuramos Swagger
  const config = new DocumentBuilder()
    .setTitle('API Knowlia')
    .setDescription('Documentación de la API Knowlia')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
