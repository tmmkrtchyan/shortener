import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONT_URL, // Next.js default port
    credentials: true,
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port, () => {
    console.log(`Start listening on port: ${port}`);
  });
}
bootstrap();
