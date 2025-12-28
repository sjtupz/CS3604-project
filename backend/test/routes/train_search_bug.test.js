const request = require('supertest');
const app = require('../../src/app');
const { run } = require('../../src/db/personal_database');

describe('Train Search Bug Fix', () => {
  beforeAll(async () => {
    // 1. Create train_tickets table
    await run(`
      CREATE TABLE IF NOT EXISTS train_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_no TEXT,
        train_type TEXT,
        start_station TEXT,
        end_station TEXT,
        start_time TEXT,
        end_time TEXT,
        duration TEXT,
        date TEXT,
        swz_num TEXT,
        yd_num TEXT,
        ed_num TEXT,
        rw_num TEXT,
        yw_num TEXT,
        yz_num TEXT,
        wz_num TEXT
      )
    `);

    // 2. Insert test data for 2025-01-01
    await run(`
      INSERT INTO train_tickets (
        train_no, start_station, end_station, date, 
        start_time, end_time, duration, ed_num
      ) VALUES (
        'G9999', '上海', '北京', '2025-01-01', 
        '08:00', '12:00', '4h', '500'
      )
    `);
  });

  afterAll(async () => {
    await run('DROP TABLE IF EXISTS train_tickets');
  });

  test('should return tickets for the correct date', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({
        from: '上海',
        to: '北京',
        date: '2025-01-01'
      });

    expect(res.statusCode).toBe(200);
    // Should find the ticket we inserted
    expect(res.body.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          trainNumber: 'G9999',
          departureTime: '08:00'
        })
      ])
    );
  });

  test('should NOT return tickets for a different date', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({
        from: '上海',
        to: '北京',
        date: '2025-01-02' // Different date
      });

    expect(res.statusCode).toBe(200);
    // Should NOT find the ticket for 2025-01-01
    // And currently (with bug), it returns hardcoded G108 etc.
    // We expect it to be empty (since we didn't insert for 01-02)
    // or at least NOT contain G9999.
    // But critically, it should NOT return the hardcoded data.
    
    // If bug exists, it returns hardcoded data (length 3).
    // If fixed, it returns length 0.
    expect(res.body.data.items).toHaveLength(0);
  });
});
