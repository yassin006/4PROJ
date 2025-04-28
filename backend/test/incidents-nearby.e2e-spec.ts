import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Incidents Nearby E2E', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should login and get JWT token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'test1234',
      })
      .expect(201);

    jwtToken = loginResponse.body.access_token;
    expect(jwtToken).toBeDefined();
  });

  it('should find nearby incidents', async () => {
    const response = await request(app.getHttpServer())
      .get('/incidents/nearby?lat=43.610769&lng=3.876716')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('_id');
      expect(response.body[0]).toHaveProperty('location');
    }
  });

  afterAll(async () => {
    await app.close();
  });
});
