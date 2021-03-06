import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EncryptModule } from './encrypt/encrypt.module';

@Module({
  imports: [AuthModule, UsersModule, EncryptModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
