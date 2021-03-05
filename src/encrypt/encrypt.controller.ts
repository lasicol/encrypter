import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { EncryptService } from './encrypt.service';
import { UsersService } from '../users/users.service';

@Controller('')
export class EncryptController {
  constructor(
    private encryptService: EncryptService,
    private usersService: UsersService,
  ) {}

  @Post('generate-key-pair')
  @UseGuards(JwtAuthGuard)
  async generateKeyPair(@Request() req) {
    const keyPair = await this.encryptService.generateKeyPair();
    this.usersService.assignKey(req.user.email, String(keyPair.publicKey));
    return keyPair;
  }

  @Post('encrypt')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  encrypt(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const userKey = this.usersService.getKey(req.user.email);
    return this.encryptService.encrypt(file.buffer, userKey);
  }

  @Post('decrypt')
  @UseGuards(JwtAuthGuard)
  decrypt(@Request() req) {
    const data = Buffer.from(req.body.data, 'base64');
    const key = req.body.key;
    const encryptedData = this.encryptService.decrypt(data, key);
    console.log(encryptedData);
    return encryptedData.toString('binary');
  }
}
