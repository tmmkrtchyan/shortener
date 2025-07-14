import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlShortenerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async handleShorten(originalUrl: string, userId?: string): Promise<{ shortUrl: string }> {
    const domainURL = this.configService.get<string>('DOMAIN_URL');

    // 1. Find or create the original_url
    let original = await this.prisma.original_url.findFirst({
      where: { url: originalUrl },
    });
    if (!original) {
      original = await this.prisma.original_url.create({
        data: { url: originalUrl },
      });
    }

    // 2. Check if a shorten_url already exists for this user and original_url
    const existingShorten = await this.prisma.shorten_url.findFirst({
      where: {
        user_id: userId!,
        original_url_id: original.id,
      },
    });
    if (existingShorten) {
      return { shortUrl: `${domainURL}/${existingShorten.url}` };
    }

    // 3. Create a new shorten_url for this user and original_url
    const shortCode = nanoid(8);
    const newShorten = await this.prisma.shorten_url.create({
      data: {
        url: shortCode,
        user_id: userId!,
        visits: 0,
        original_url_id: original.id,
      },
    });

    return { shortUrl: `${domainURL}/${shortCode}` };
  }

  async findByShortUrl(shortUrl: string) {
    // Find the shorten_url by its url (short code)
    const shorten = await this.prisma.shorten_url.findUnique({
      where: { url: shortUrl },
      include: { original_url: true },
    });
    if (!shorten || !shorten.original_url) {
      const frontUrl = this.configService.get<string>('FRONT_URL');
      return { url: `${frontUrl}/not-found` };
    }
    return { url: shorten.original_url.url, id: shorten.id };
  }

  async increaseVisitsById(shortenUrlId: string): Promise<{ success: boolean; visits: number }> {
    try {
      const updatedRecord = await this.prisma.shorten_url.update({
        where: { id: shortenUrlId },
        data: {
          visits: {
            increment: 1,
          },
        },
        select: {
          visits: true,
        },
      });
      return { success: true, visits: updatedRecord.visits };
    } catch (error) {
      if (error.code === 'P2025') {
        // Record not found
        throw new NotFoundException(`Shorten URL with ID ${shortenUrlId} not found`);
      }
      throw error;
    }
  }

  async getAllUrlsWithUserFlag(userId: string, page: number = 1, pageSize: number = 5) {
    const skip = (page - 1) * pageSize;
    const [urls, total] = await Promise.all([
      this.prisma.shorten_url.findMany({
        where: { user_id: userId },
        orderBy: { visits: 'desc' },
        skip,
        take: pageSize,
        include: { original_url: true },
      }),
      this.prisma.shorten_url.count({ where: { user_id: userId } }),
    ]);
    const domainURL = this.configService.get<string>('DOMAIN_URL');
    return {
      urls: urls.map(url => ({
        id: url.id,
        originalUrl: url.original_url?.url,
        shortUrl: `${domainURL}/${url.url}`,
        visits: url.visits,
        createdAt: url.created_at,
        isUserUrl: true,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updateSlug(userId: string, shortenUrlId: string, newSlug: string) {
    // Ensure user owns the shorten_url
    const shorten = await this.prisma.shorten_url.findUnique({
      where: { id: shortenUrlId },
    });
    if (!shorten) {
      throw new NotFoundException('Shorten URL not found');
    }
    if (shorten.user_id !== userId) {
      throw new BadRequestException('You do not have permission to update this URL');
    }
    // Check if the new slug is already taken
    const existing = await this.prisma.shorten_url.findUnique({
      where: { url: newSlug },
    });
    if (existing) {
      throw new BadRequestException('Slug already exists');
    }
    // Update the url (slug)
    const updated = await this.prisma.shorten_url.update({
      where: { id: shortenUrlId },
      data: { url: newSlug },
    });
    return updated;
  }
}
