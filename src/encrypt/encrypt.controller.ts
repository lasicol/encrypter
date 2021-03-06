import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  HttpException,
  Body,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { EncryptService } from './encrypt.service';
import { UsersService } from '../users/users.service';
import { DecryptDto } from './dto/decrypt.dto';

@Controller('')
export class EncryptController {
  constructor(
    private encryptService: EncryptService,
    private usersService: UsersService,
  ) {}

  @Post('generate-key-pair')
  @UseGuards(JwtAuthGuard)
  async generateKeyPair(@Request() req) {
    try {
      const keyPair = await this.encryptService.generateKeyPair();
      this.usersService.assignKey(req.user.email, keyPair.publicKey);
      return keyPair;
    } catch (err) {
      throw new HttpException('Key generation failed', 500);
    }
  }

  @Post('encrypt')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  encrypt(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const userKey = this.usersService.getKey(req.user.email);
    if (!userKey) throw new HttpException('No key associated to the user', 400);
    try {
      return this.encryptService.encrypt(file.buffer, userKey);
    } catch (err) {
      throw new HttpException('File encryption failed', 500);
    }
  }

  @Post('decrypt')
  @UseGuards(JwtAuthGuard)
  decrypt(@Request() req, @Body() decryptDto: DecryptDto) {
    const data = Buffer.from(decryptDto.data, 'base64');
    const key = req.body.key;
    const encryptedData = this.encryptService.decrypt(data, key);
    console.log(encryptedData);
    return encryptedData.toString('binary');
  }
}
