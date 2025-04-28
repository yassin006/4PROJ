import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Incidents Endpoints', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  it('should create an incident', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/incidents')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'Accident on Route A',
        description: 'Accident reported on Route A',
        type: 'accident',
        location: '{"type":"Point","coordinates":[3.876716,43.610769]}',
      })
      .expect(201);

    expect(createResponse.body).toHaveProperty('_id');
  });

  afterAll(async () => {
    await app.close();
  });
});
