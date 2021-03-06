import { Test, TestingModule } from '@nestjs/testing';
import { EncryptController } from './encrypt.controller';
import { EncryptService } from './encrypt.service';
import { UsersService } from '../users/users.service';
import { HttpException } from '@nestjs/common';
import { Express } from 'express';

describe('EncryptController', () => {
  let controller: EncryptController;
  let encryptService: EncryptService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncryptController],
      providers: [EncryptService, UsersService],
    }).compile();

    controller = module.get<EncryptController>(EncryptController);
    encryptService = module.get<EncryptService>(EncryptService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('generateKeyPair', () => {
    const keyPair = {
      privateKey: 'key1',
      publicKey: 'key2',
    };
    const reqFake = { user: { email: 'fake@email.com' } };
    it('should generate key pair', async () => {
      jest.spyOn(encryptService, 'generateKeyPair').mockResolvedValue(keyPair);
      expect(await controller.generateKeyPair(reqFake)).toBe(keyPair);
    });

    it('should throw error when key generation failed', async () => {
      jest.spyOn(encryptService, 'generateKeyPair').mockImplementation(() => {
        throw new Error('Fake error');
      });
      try {
        await controller.generateKeyPair(reqFake);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('encrypt', () => {
    const publicKeyFake = 'FakeKey';
    const ecodedFileFake = 'fakeBase64String';
    const reqFake = { user: { email: 'fake@email.com' } };
    const fileFake: Express.Multer.File = {
      destination: '',
      fieldname: '',
      filename: '',
      mimetype: '',
      originalname: '',
      path: '',
      size: 0,
      stream: null,
      encoding: null,
      buffer: Buffer.from('FAKEBUFFER'),
    };
    it('should encrypt', async () => {
      jest.spyOn(encryptService, 'encrypt').mockReturnValue(ecodedFileFake);
      jest.spyOn(usersService, 'getKey').mockReturnValue(publicKeyFake);
      expect(controller.encrypt(reqFake, fileFake)).toBe(ecodedFileFake);
    });
    it('should throw error when there is no key associated to the user', async () => {
      jest.spyOn(usersService, 'getKey').mockReturnValue(undefined);
      try {
        controller.encrypt(reqFake, fileFake);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
    });
    it('should throw error when ecrypt function failed', async () => {
      jest.spyOn(usersService, 'getKey').mockReturnValue(publicKeyFake);
      jest.spyOn(encryptService, 'encrypt').mockImplementation(() => {
        throw new Error('Fake error');
      });

      try {
        controller.encrypt(reqFake, fileFake);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
    });
  });
});
