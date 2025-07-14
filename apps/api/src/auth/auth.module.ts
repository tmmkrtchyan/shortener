import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { DatabaseModule } from 'src/database.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-super-secret-jwt-key-change-in-production', // Use env var in production!
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
