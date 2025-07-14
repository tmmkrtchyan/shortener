import { IsUrl, IsNotEmpty } from 'class-validator';

export class ShortenUrlDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
