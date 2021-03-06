import { Injectable } from '@nestjs/common';
import { generateKeyPair } from 'crypto';
import { promisify } from 'util';
import { publicEncrypt, privateDecrypt, constants } from 'crypto';

@Injectable()
export class EncryptService {
  private GENERATE_KEYS_OPTIONS = {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  };

  private KEY_OPTIONS = {
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  };

  private ENCRYPT_CHUNK = 200;
  private DECRYPT_CHUNK = 512;

  async generateKeyPair() {
    const generateKeyPairPromise = promisify(generateKeyPair);
    try {
      const { publicKey, privateKey } = await generateKeyPairPromise(
        'rsa',
        this.GENERATE_KEYS_OPTIONS,
      );
      return { publicKey: String(publicKey), privateKey: String(privateKey) };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private splitBuffer(data: Buffer, chunkSize: number): Array<Buffer> {
    const chunksArray = [];
    let i = 0;
    while (i < data.length) {
      chunksArray.push(data.slice(i, (i += chunkSize)));
    }
    return chunksArray;
  }

  encrypt(data: Buffer, key: string): string {
    try {
      const chunksArray = this.splitBuffer(data, this.ENCRYPT_CHUNK);
      const encryptedChunks = chunksArray.map((buffChunk) => {
        return publicEncrypt(
          {
            key,
            ...this.KEY_OPTIONS,
          },
          buffChunk,
        );
      });
      return Buffer.concat(encryptedChunks).toString('base64');
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  decrypt(data: Buffer, key: string): Buffer {
    const chunksArray = this.splitBuffer(data, this.DECRYPT_CHUNK);
    const decryptedChunks = chunksArray.map((buffChunk) => {
      return privateDecrypt(
        {
          key,
          ...this.KEY_OPTIONS,
        },
        buffChunk,
      );
    });
    return Buffer.concat(decryptedChunks);
  }
}
