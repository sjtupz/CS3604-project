const request = require('supertest');
const app = require('../../src/app');
const { run, waitForInit } = require('../../src/db/personal_database');

describe('API-Passengers Management', () => {
  const userToken = 'test-token';
  const userId = 'test-user-id';

  beforeAll(async () => {
    await waitForInit();
  });

  describe('GET /api/passengers', () => {
    test('Given user is logged in When requesting passenger list Then returns 200 and list', async () => {
      const res = await request(app)
        .get('/api/passengers')
        .set('Authorization', userToken);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.data).toHaveProperty('items');
      expect(Array.isArray(res.body.data.items)).toBe(true);
    });

    test('Given user is NOT logged in When requesting passenger list Then returns 401', async () => {
      const res = await request(app).get('/api/passengers');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/passengers', () => {
    test('Given valid passenger data When adding passenger Then returns 201 and new id', async () => {
      const newPassenger = {
        name: 'Test Passenger',
        idType: '居民身份证',
        idNumber: '110101199001011234',
        phone: '13800138000',
        type: '成人'
      };

      const res = await request(app)
        .post('/api/passengers')
        .set('Authorization', userToken)
        .send(newPassenger);

      expect(res.statusCode).toBe(201);
      expect(res.body.code).toBe(201);
      expect(res.body.data).toHaveProperty('id');
    });

    test('Given missing required fields When adding passenger Then returns 400', async () => {
      const invalidPassenger = {
        name: '', // Missing name
        idType: '居民身份证'
      };

      const res = await request(app)
        .post('/api/passengers')
        .set('Authorization', userToken)
        .send(invalidPassenger);

      // Note: The skeleton returns 501, so this will fail (which is good). 
      // Ideally, the skeleton should handle validation if we wanted to test validation logic, 
      // but "skeleton" implies no logic. So failure is expected.
      // However, if we want to distinguish between "Not Implemented" and "Validation Error",
      // the test will just fail saying "Expected 400, got 501". This is acceptable for RED phase.
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/passengers/:id', () => {
    test('Given valid update data When updating passenger Then returns 200', async () => {
      // Create a passenger first
      const newPassenger = {
        name: 'To Be Updated',
        idType: '居民身份证',
        idNumber: '110101199001015678',
        phone: '13800138000',
        type: '成人'
      };
      const createRes = await request(app)
        .post('/api/passengers')
        .set('Authorization', userToken)
        .send(newPassenger);
      const passengerId = createRes.body.data.id;

      const updateData = {
        name: 'Updated Name',
        phone: '13900139000'
      };

      const res = await request(app)
        .put(`/api/passengers/${passengerId}`)
        .set('Authorization', userToken)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe(200);
    });
  });

  describe('DELETE /api/passengers', () => {
    test('Given list of ids When batch deleting Then returns 200', async () => {
      const idsToDelete = ['uuid-1', 'uuid-2'];

      const res = await request(app)
        .delete('/api/passengers')
        .set('Authorization', userToken)
        .send({ ids: idsToDelete });

      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe(200);
    });
  });
});
