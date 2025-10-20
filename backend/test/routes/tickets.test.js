const request = require('supertest');
const app = require('../../src/app');
const database = require('../../src/config/database');

describe('Ticket Routes', () => {
  beforeAll(async () => {
    // 连接测试数据库
    await database.connect(true);
  });

  afterAll(async () => {
    // 关闭数据库连接
    await database.close();
  });

  beforeEach(async () => {
    // 清理测试数据
    // TODO: 实现数据清理逻辑
  });

  describe('POST /api/queryTickets', () => {
    // 基于API-POST-QueryTickets的acceptanceCriteria编写测试

    it('应该成功查询车票并返回结果列表', async () => {
      const queryData = {
        departure: '北京',
        destination: '上海',
        departureDate: '2024-02-01',
        passengerType: 'adult'
      };

      const response = await request(app)
        .post('/api/queryTickets')
        .send(queryData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('tickets');
      expect(Array.isArray(response.body.tickets)).toBe(true);
      expect(response.body).toHaveProperty('total');
      expect(typeof response.body.total).toBe('number');
    });

    it('应该验证必需的查询参数', async () => {
      const incompleteQuery = {
        departure: '北京'
        // 缺少必需字段
      };

      const response = await request(app)
        .post('/api/queryTickets')
        .send(incompleteQuery)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('应该验证出发日期不能是过去的日期', async () => {
      const pastDateQuery = {
        departure: '北京',
        destination: '上海',
        departureDate: '2020-01-01', // 过去的日期
        passengerType: 'adult'
      };

      const response = await request(app)
        .post('/api/queryTickets')
        .send(pastDateQuery)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', '出发日期不能是过去的日期');
    });

    it('应该支持返程日期查询', async () => {
      const roundTripQuery = {
        departure: '北京',
        destination: '上海',
        departureDate: '2024-02-01',
        returnDate: '2024-02-05',
        passengerType: 'adult'
      };

      const response = await request(app)
        .post('/api/queryTickets')
        .send(roundTripQuery)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('tickets');
      expect(response.body).toHaveProperty('returnTickets');
    });

    it('应该验证返程日期不能早于出发日期', async () => {
      const invalidRoundTripQuery = {
        departure: '北京',
        destination: '上海',
        departureDate: '2024-02-05',
        returnDate: '2024-02-01', // 返程日期早于出发日期
        passengerType: 'adult'
      };

      const response = await request(app)
        .post('/api/queryTickets')
        .send(invalidRoundTripQuery)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', '返程日期不能早于出发日期');
    });

    it('应该支持不同乘客类型的查询', async () => {
      const studentQuery = {
        departure: '北京',
        destination: '上海',
        departureDate: '2024-02-01',
        passengerType: 'student'
      };

      const response = await request(app)
        .post('/api/queryTickets')
        .send(studentQuery)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('tickets');
    });

    it('应该在没有找到车票时返回空列表', async () => {
      const noResultQuery = {
        departure: '不存在的城市',
        destination: '另一个不存在的城市',
        departureDate: '2024-02-01',
        passengerType: 'adult'
      };

      const response = await request(app)
        .post('/api/queryTickets')
        .send(noResultQuery)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('tickets');
      expect(response.body.tickets).toHaveLength(0);
      expect(response.body).toHaveProperty('total', 0);
    });

    it('应该支持分页查询', async () => {
      const paginatedQuery = {
        departure: '北京',
        destination: '上海',
        departureDate: '2024-02-01',
        passengerType: 'adult',
        page: 1,
        limit: 10
      };

      const response = await request(app)
        .post('/api/queryTickets')
        .send(paginatedQuery)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('tickets');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(response.body.pagination).toHaveProperty('total');
    });

    it('应该返回正确的车票信息结构', async () => {
      const queryData = {
        departure: '北京',
        destination: '上海',
        departureDate: '2024-02-01',
        passengerType: 'adult'
      };

      const response = await request(app)
        .post('/api/queryTickets')
        .send(queryData)
        .expect(200);

      if (response.body.tickets.length > 0) {
        const ticket = response.body.tickets[0];
        expect(ticket).toHaveProperty('trainNumber');
        expect(ticket).toHaveProperty('departure');
        expect(ticket).toHaveProperty('destination');
        expect(ticket).toHaveProperty('departureTime');
        expect(ticket).toHaveProperty('arrivalTime');
        expect(ticket).toHaveProperty('duration');
        expect(ticket).toHaveProperty('seats');
        expect(Array.isArray(ticket.seats)).toBe(true);
      }
    });
  });
});