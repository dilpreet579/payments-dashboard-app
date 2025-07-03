import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('/auth/login (POST) should return JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' })
      .expect(201);
    expect(res.body.access_token).toBeDefined();
    jwt = res.body.access_token;
  });

  it('/payments (GET) should require JWT', async () => {
    await request(app.getHttpServer())
      .get('/payments')
      .expect(401);
  });

  it('/payments (GET) should return payments with JWT', async () => {
    const res = await request(app.getHttpServer())
      .get('/payments')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('/payments (POST) should create a payment', async () => {
    const res = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        amount: 50,
        receiver: 'Test User',
        status: 'success',
        method: 'card',
      })
      .expect(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.amount).toBe(50);
  });

  afterAll(async () => {
    await app.close();
  });
});
