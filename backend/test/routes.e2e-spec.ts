import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Routes E2E', () => {
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

  it('should calculate a route', async () => {
    const response = await request(app.getHttpServer())
      .post('/routes/calculate')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        start: { lat: 43.610769, lng: 3.876716 },
        end: { lat: 43.296482, lng: 5.36978 },
        options: { avoidTolls: true },
      })
      .expect(201);

    expect(response.body.route).toBeDefined();
    expect(response.body.distance).toBeDefined();
    expect(response.body.duration).toBeDefined();
    expect(response.body.instructions).toBeInstanceOf(Array);
  });

  it('should recalculate a route with incident', async () => {
    const response = await request(app.getHttpServer())
      .post('/routes/recalculate')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        start: { lat: 43.610769, lng: 3.876716 },
        end: { lat: 43.296482, lng: 5.36978 },
        incident: { lat: 43.5, lng: 4.5 },
      })
      .expect(201);

    expect(response.body.newRoute).toBeDefined();
    expect(response.body.instructions).toBeInstanceOf(Array);
  });

  afterAll(async () => {
    await app.close();
  });
});
