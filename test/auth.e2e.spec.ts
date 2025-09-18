import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register -> /auth/login flow', async () => {
    const username = `testuser${Date.now()}`;
    const password = 'testpass';

    // register
    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password })
      .expect(201);

    expect(reg.body.username).toBe(username);

    // login
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201);

    expect(login.body.access_token).toBeTruthy();
  });
});
