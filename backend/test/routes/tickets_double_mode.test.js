const request = require('supertest');
const app = require('../../src/app');
const { getDb } = require('../../src/db/personal_database');
const { insertTrainTickets } = require('../../src/db/tickets');

describe('Double Mode Ticket Search', () => {
  beforeAll(async () => {
    // Trigger DB initialization
    getDb();
    // Wait for async initialization to complete (simple workaround)
    await new Promise(r => setTimeout(r, 1000));

    const seedData = [
      // Outbound: Shanghai -> Beijing on 2023-10-01
      { train_no: 'G1', train_type: 'G', start_station: 'Shanghai', end_station: 'Beijing', start_time: '09:00', end_time: '13:00', duration: '04:00', date: '2023-10-01', swz_num: '10', yd_num: '5', ed_num: '20', rw_num: '0', yw_num: '0', yz_num: '0', wz_num: '0' },
      { train_no: 'G2', train_type: 'G', start_station: 'Shanghai', end_station: 'Beijing', start_time: '14:00', end_time: '18:00', duration: '04:00', date: '2023-10-01', swz_num: '5', yd_num: '2', ed_num: '有', rw_num: '0', yw_num: '0', yz_num: '0', wz_num: '0' },
      
      // Return: Beijing -> Shanghai on 2023-10-05
      { train_no: 'G3', train_type: 'G', start_station: 'Beijing', end_station: 'Shanghai', start_time: '10:00', end_time: '14:00', duration: '04:00', date: '2023-10-05', swz_num: '8', yd_num: '1', ed_num: '15', rw_num: '0', yw_num: '0', yz_num: '0', wz_num: '0' }
    ];

    try {
      await insertTrainTickets(seedData);
    } catch (e) {
      console.error('Test Setup Insert Error:', e);
    }
  });

  afterAll(async () => {
    // Avoid accessing db if not initialized or if test crashes
    try {
        const db = getDb();
        if (db) {
            await new Promise((resolve, reject) => {
                db.run('DELETE FROM train_tickets', (err) => {
                    if (err) resolve(); // Ignore error on cleanup
                    else resolve();
                });
            });
        }
    } catch (e) {}
  });

  test('GET /api/tickets - One-way mode (Outbound only)', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .query({
        trip_type: 'one-way',
        start_station: 'Shanghai',
        end_station: 'Beijing',
        outbound_date: '2023-10-01'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('outbound_tickets');
    expect(res.body.outbound_tickets).toHaveLength(2);
    // In one-way mode, return_tickets should be empty array
    expect(res.body.return_tickets).toEqual([]); 
    expect(res.body.outbound_tickets[0].train_no).toBe('G1');
  });

  test('GET /api/tickets - Round-trip mode (Outbound + Return)', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .query({
        trip_type: 'round-trip',
        start_station: 'Shanghai',
        end_station: 'Beijing',
        outbound_date: '2023-10-01',
        return_date: '2023-10-05'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('outbound_tickets');
    expect(res.body).toHaveProperty('return_tickets');
    
    expect(res.body.outbound_tickets).toHaveLength(2);
    expect(res.body.return_tickets).toHaveLength(1);
    expect(res.body.return_tickets[0].train_no).toBe('G3');
  });
});
