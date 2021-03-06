import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { EncryptController } from './encrypt.controller';
import { EncryptService } from './encrypt.service';

@Module({
  providers: [EncryptService],
  controllers: [EncryptController],
  imports: [UsersModule],
})
export class EncryptModule {}
