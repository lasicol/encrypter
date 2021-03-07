import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { INestApplication } from '@nestjs/common';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should sign-in', async () => {
    const resp = await request(app.getHttpServer())
      .post('/sign-in')
      .send({
        email: 'john@change.me',
        password: 'changeme1',
      })
      .expect(200);
    expect(resp.body).toHaveProperty('authToken');
  });

  it('should return bad request when the body is incorrect', async () => {
    const resp = await request(app.getHttpServer())
      .post('/sign-in')
      .send({
        FakeEmailProp: 'john@change.me',
        password: 'changeme1',
      })
      .expect(400);
    expect(resp.body).toHaveProperty('error');
    expect(resp.body.error).toEqual('Bad Request');
  });

  afterAll(async () => {
    await app.close();
  });
});
