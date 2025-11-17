import request from 'supertest';
import app from '../../app';
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

describe('Ticket Filters & Sorting Integration', () => {
  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '../../../data/database.sqlite');
    const seedPath = path.resolve(__dirname, '../../../seed_tickets.sql');
    const sql = fs.readFileSync(seedPath, 'utf-8');
    const db = new Database(dbPath);
    db.exec(sql);
    db.close();
  });

  it('supports filter_type for train types', async () => {
    const res = await request(app)
      .get('/api/v1/tickets?fromStation=北京&toStation=上海&date=2025-11-20&filter_type=D');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    const allD = res.body.data.every((t: any) => String(t.trainNo).startsWith('D'));
    expect(allD).toBe(true);
  });

  it('supports filter_seat 二等座 and sort_by 价格', async () => {
    const res = await request(app)
      .get(encodeURI('/api/v1/tickets?fromStation=北京&toStation=上海&date=2025-11-20&filter_seat=二等座&sort_by=价格'));
    expect(res.status).toBe(200);
    const list = res.body.data as any[];
    expect(list.length).toBeGreaterThan(0);
    const hasSeat = (t: any) => Array.isArray(t.seats) && t.seats.some((s: any) => s.type === '二等座');
    expect(list.every(hasSeat)).toBe(true);
    const priceOf = (t: any) => {
      const s = t.seats.find((x: any) => x.type === '二等座');
      return s?.price ?? Number.MAX_SAFE_INTEGER;
    };
    const prices = list.map(priceOf);
    const isAsc = prices.every((p, i) => i === 0 || p >= prices[i-1]);
    expect(isAsc).toBe(true);
  });

  it('supports filter_type multiple values (G,D,K)', async () => {
    const res = await request(app)
      .get('/api/v1/tickets?fromStation=北京&toStation=上海&date=2025-11-20&filter_type=G,D,K');
    expect(res.status).toBe(200);
    const list = res.body.data as any[];
    expect(list.length).toBeGreaterThan(0);
    const ok = list.every(t => ['G','D','K'].includes(String(t.trainNo)[0]));
    expect(ok).toBe(true);
  });
});