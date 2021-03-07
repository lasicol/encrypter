import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  HttpException,
  Body,
  HttpCode,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { EncryptService } from './encrypt.service';
import { UsersService } from '../users/users.service';
import { DecryptDto } from './dto/decrypt.dto';
import { ApiBody, ApiConsumes, ApiHeader, ApiResponse } from '@nestjs/swagger';

@Controller('')
export class EncryptController {
  constructor(
    private encryptService: EncryptService,
    private usersService: UsersService,
  ) {}

  @Post('generate-key-pair')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @ApiHeader({
    name: 'Authorization',
    schema: { type: 'string', example: 'Bearer {{AuthToken}}' },
  })
  @ApiResponse({
    status: 201,
    description: 'The key pair has been created.',
  })
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
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          format: 'binary',
        },
      },
    },
  })
  @ApiHeader({
    name: 'Authorization',
    schema: { type: 'string', example: 'Bearer {{AuthToken}}' },
  })
  @ApiResponse({
    status: 200,
    description: 'File has been encrypted',
  })
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
  @HttpCode(200)
  @ApiHeader({
    name: 'Authorization',
    schema: { type: 'string', example: 'Bearer {{AuthToken}}' },
  })
  @ApiResponse({
    status: 200,
    description: 'File has been decrypted',
  })
  @UseGuards(JwtAuthGuard)
  decrypt(@Request() req, @Body() decryptDto: DecryptDto) {
    const data = Buffer.from(decryptDto.data, 'base64');
    const key = req.body.key;
    const encryptedData = this.encryptService.decrypt(data, key);
    console.log(encryptedData);
    return encryptedData.toString('binary');
  }
}
