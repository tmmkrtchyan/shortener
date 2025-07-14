import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(username: string): Promise<{ id: string; username: string }> {
    try {
      const user = await this.prismaService.user.create({
        data: { username },
        select: {
          id: true,
          username: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Username '${username}' already exists`);
      }
      throw error;
    }
  }

  async findUserByUsername(username: string): Promise<{ id: string; username: string } | null> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
      },
    });
    return user;
  }

  async loginOrCreateUser(username: string): Promise<{ id: string; username: string; isNew: boolean }> {
    // First try to find existing user
    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      return { ...existingUser, isNew: false };
    }

    // If not found, create new user
    const newUser = await this.createUser(username);
    return { ...newUser, isNew: true };
  }

  async login(username: string) {
    // Find or create user
    const user = await this.loginOrCreateUser(username);

    // Generate JWT payload
    const payload = {
      sub: user.id,
      username: user.username
    };

    // Sign and return JWT
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        isNew: user.isNew,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      return null;
    }
  }
}
