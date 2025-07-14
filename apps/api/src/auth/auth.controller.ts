import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { JwtPayload } from './types';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

export class LoginDto {
  username: string;
}

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: JwtPayload | null) {
    if (!user) {
      return { message: 'Not authenticated' };
    }
    return {
      id: user.sub,
      username: user.username,
    };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.username);
  }
}
