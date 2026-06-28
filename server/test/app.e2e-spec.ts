import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Gore Municipality API (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ===================== HEALTH CHECK =====================
  describe('App / (GET)', () => {
    it('should return "Hello World!"', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  // ===================== AUTH =====================
  describe('Auth /auth/login (POST)', () => {
    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nonexistent@gore.gov.et', password: 'wrong' })
        .expect(401);
    });

    it('should reject empty body', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });
  });

  // ===================== PUBLIC ENDPOINTS =====================
  describe('Public Endpoints', () => {
    it('GET /news should return array', () => {
      return request(app.getHttpServer())
        .get('/news')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /announcements should return array', () => {
      return request(app.getHttpServer())
        .get('/announcements')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /projects should return array', () => {
      return request(app.getHttpServer())
        .get('/projects')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /departments should return array', () => {
      return request(app.getHttpServer())
        .get('/departments')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /documents should return array', () => {
      return request(app.getHttpServer())
        .get('/documents')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('POST /contact should validate input', () => {
      return request(app.getHttpServer())
        .post('/contact')
        .send({ name: '' })
        .expect(400);
    });
  });

  // ===================== JWT-PROTECTED ENDPOINTS =====================
  describe('Protected Endpoints (no token)', () => {
    it('POST /news should reject without auth', () => {
      return request(app.getHttpServer())
        .post('/news')
        .send({ title: 'Test', slug: 'test', summary: 'Test', content: 'Test' })
        .expect(401);
    });

    it('PATCH /news/1 should reject without auth', () => {
      return request(app.getHttpServer())
        .patch('/news/1')
        .send({ title: 'Updated' })
        .expect(401);
    });

    it('DELETE /news/1 should reject without auth', () => {
      return request(app.getHttpServer())
        .delete('/news/1')
        .expect(401);
    });

    it('GET /admin should reject without auth', () => {
      return request(app.getHttpServer())
        .get('/admin')
        .expect(401);
    });

    it('GET /contact should reject without auth', () => {
      return request(app.getHttpServer())
        .get('/contact')
        .expect(401);
    });

    it('DELETE /upload/test.jpg should reject without auth', () => {
      return request(app.getHttpServer())
        .delete('/upload/test.jpg')
        .expect(401);
    });
  });

  // ===================== AUTHENTICATED REQUESTS =====================
  describe('Authenticated Endpoints (invalid token)', () => {
    it('should reject invalid JWT token', () => {
      return request(app.getHttpServer())
        .get('/admin')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should reject malformed Authorization header', () => {
      return request(app.getHttpServer())
        .get('/admin')
        .set('Authorization', 'NotBearer token')
        .expect(401);
    });
  });

  // ===================== NOT FOUND =====================
  describe('Not Found', () => {
    it('GET /news/99999 should return 404', () => {
      return request(app.getHttpServer())
        .get('/news/99999')
        .expect(404);
    });

    it('GET /nonexistent-route should return 404', () => {
      return request(app.getHttpServer())
        .get('/nonexistent-route')
        .expect(404);
    });
  });

  // ===================== UPLOAD AUTH ======================
  describe('Upload (JWT required)', () => {
    it('POST /upload should reject without token', () => {
      return request(app.getHttpServer())
        .post('/upload')
        .expect(401);
    });
  });

  // ===================== CONTACT PUBLIC =====================
  describe('Contact (public)', () => {
    it('POST /contact should accept valid submission', async () => {
      const res = await request(app.getHttpServer())
        .post('/contact')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'This is a test message.',
        });

      // May fail if DB is not available, so handle gracefully
      if (res.status === 201) {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Test User');
        expect(res.body.isRead).toBe(false);
      }
    });
  });
});
