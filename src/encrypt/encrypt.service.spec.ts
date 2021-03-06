import { Test, TestingModule } from '@nestjs/testing';
import { EncryptService } from './encrypt.service';

describe('EncryptService', () => {
  let service: EncryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptService],
    }).compile();

    service = module.get<EncryptService>(EncryptService);
  });

  describe('generateKeyPair', () => {
    it('should generate key pair', async () => {
      const resp = await service.generateKeyPair();
      expect(resp).toHaveProperty('publicKey');
      expect(resp).toHaveProperty('privateKey');
      expect(typeof resp.publicKey).toEqual('string');
      expect(typeof resp.privateKey).toEqual('string');
    });
  });

  describe('encrypt', () => {
    const keyFake =
      '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAuPOr6+KCfr9aDU9AEHY3\n4dPFSkcsYBP1lI2rDImYxnh9c6iUJ6+GEDt5PCQc6xrL63azxvs+6fjeSURSGj9o\n1t6Vghdjw6c9Y6JrHEXs2raVZQmBESD5WoZA6DWeqBxJwFeHgiOiKg/1nRGZxvg3\nhC/mqkmc3bWB6AVCj7B43zlxNIiAWKY/p1SoxCpaA6JpsjcIos73ZBDsMc/avw6R\na29d+MrHWUx6u9RjPPGSaapT8Hg2ijaccRMRERla6emxs9jlmhK/w8q7svMDCGgU\nlOWxNkxCC2f10fbgy5YeaNrSA83b7Wya1wab5EqZCxozT8HBSR0Wz4oUS9DrJUEi\nRZrpcEPMUptnpYi8jvOuQseCBWhcbb+A9PWaBVep4amXx1IumrtjhEMb1n8EA8Kk\njobihMsfo9QjQZmp5QpZzNxvA2Mx+AGCak6fKrVjnYXCMNLK5pLSglK/IrCwrK5o\nXz00LDCIZXB3DYhhbNKjrt6mmr/3P9X5d+lZ5lKOu7hopMcs9R25Jz8KXCTxYeQc\nomvAeFFquwQg1M1zZ3WebN0XsNAjVlPp5jeROs4hMX2q+BG10XZs/DJdtFpIarZz\nlSyLFlHcgZlWrmo7CqoHdTDEwewoOUHjp6xCHxZVRIEYVKsJYhm/MC4cEuMzky5W\neejHi2jTf10fENsut/Ekop8CAwEAAQ==\n-----END PUBLIC KEY-----\n';
    const dataFake =
      'PQKg6DuVJxedCyLSvUdsmchtHPtR4n9CZNyKgCIHzTUGqOajtpveKk47gSB4H3OFK64ngnP6vjFgNRMCKkCpqUyKfhs7fTh8xU3YMrF6hndJ5uFv3DU7Bcor8zWVbFK6ouGo/qWCoN82Qmq5+WVVCUoJ4t5sIIesS/uKuo8xDZQPjXfaJ0bRIEcgfX/TqxGcFcEMrQpKVaozDE/OfZdDLUFfj7vkCkAORKp+BXAtyFW3QsxPih7zvPFXxedjjF+6/wHXwK17pZhGzKAVzFL1Cqq+Jgo1Nd8jLOE=';
    it('should generate encrypt data', async () => {
      const resp = service.encrypt(Buffer.from(dataFake), keyFake);
      expect(typeof resp).toEqual('string');
    });
  });
});
