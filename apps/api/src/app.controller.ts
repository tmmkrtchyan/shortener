import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from "express";
import { UrlShortenerService } from './url-shortener/url-shortener.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly urlShortenerService: UrlShortenerService) { }

  @Get(':slug')
  async getShortenedUrl(@Param('slug') slug: string, @Res() res: Response) {
    const { url, id } = await this.urlShortenerService.findByShortUrl(slug);
    if (id) {
      await this.urlShortenerService.increaseVisitsById(id);
    }

    // Add cache-busting headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return res.redirect(302, url);
  }
}
