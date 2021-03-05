import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { EncryptController } from './encrypt/encrypt.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EncryptService } from './encrypt/encrypt.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AuthController, EncryptController],
  providers: [EncryptService],
})
export class AppModule {}
