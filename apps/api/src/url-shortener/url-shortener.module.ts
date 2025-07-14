import { Module, } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, PrismaService],
  exports: [UrlShortenerService],
})
export class UrlShortenerModule {}
