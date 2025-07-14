import { Controller, Post, Body, Param, ParseIntPipe, Get, UseGuards, Query, Patch } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UrlShortenerService } from './url-shortener.service';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/types';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/urls')
@UseGuards(JwtAuthGuard)
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post('shorten')
  async shorten(@Body() body: ShortenUrlDto, @CurrentUser() user: JwtPayload | null) {
    const userId = user?.sub;
    return this.urlShortenerService.handleShorten(body.url, userId);
  }

  @Get('all')
  async getAllUrls(
    @CurrentUser() user: JwtPayload | null,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string
  ) {
    const userId = user?.sub;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 5;
    return this.urlShortenerService.getAllUrlsWithUserFlag(userId, pageNum, pageSizeNum);
  }

  @Patch('update-slug/:urlId')
  async updateSlug(
    @CurrentUser() user: JwtPayload | null,
    @Param('urlId') urlId: string,
    @Body('newSlug') newSlug: string
  ) {
    const userId = user?.sub;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    if (!newSlug || typeof newSlug !== 'string' || newSlug.length < 3) {
      throw new Error('Invalid slug');
    }
    return this.urlShortenerService.updateSlug(userId, urlId, newSlug);
  }
}
