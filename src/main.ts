import 'reflect-metadata'
import cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './infra/env/env.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const envService = app.get(EnvService)
  const port = envService.get('PORT')
  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('Kolab Backend')
    .setDescription('The Kolab API backend challenge')
    .setVersion('1.0')
    .addTag('Users')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(port)
}
bootstrap()
