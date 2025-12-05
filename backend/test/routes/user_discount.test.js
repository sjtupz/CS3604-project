const request = require('supertest');
const app = require('../../src/app');
const { run, waitForInit } = require('../../src/db/personal_database');
const { generateToken } = require('../../src/utils/auth');

describe('API: User Discount Type', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await waitForInit();
  });

  beforeEach(async () => {
    await run('DELETE FROM users');
    
    // Create test user
    const result = await new Promise((resolve, reject) => {
      const db = require('../../src/db/personal_database').db;
      db.run(
        `INSERT INTO users (username, password, real_name, id_type, id_number, phone_number, discount_type) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['testuser', 'password', 'Test User', '身份证', '110101199001011234', '13800138000', '成人'],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });
    
    userId = result.lastID;
    token = generateToken({ id: userId, username: 'testuser' });
  });

  test('Should update discount type to Student', async () => {
    const res = await request(app)
      .put('/api/user/discount-type')
      .set('Authorization', `Bearer ${token}`)
      .send({
        discountType: '学生',
        studentQualification: {
          school: 'Test University',
          studentId: '20230001'
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Discount type updated successfully.');

    // Verify in DB
    const user = await new Promise((resolve, reject) => {
      const db = require('../../src/db/personal_database').db;
      db.get('SELECT discount_type, student_qualification FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    expect(user.discount_type).toBe('学生');
    const qualification = JSON.parse(user.student_qualification);
    expect(qualification.school).toBe('Test University');
  });

  test('Should reject invalid discount type', async () => {
    const res = await request(app)
      .put('/api/user/discount-type')
      .set('Authorization', `Bearer ${token}`)
      .send({
        discountType: 'InvalidType'
      });

    expect(res.statusCode).toBe(400);
  });
});
