const request = require('supertest');
const express = require('express');
const ordersRouter = require('../../src/routes/orders');
const { initializeDatabase, run } = require('../../src/db/personal_database');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
// Mock auth middleware
app.use((req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, 'dev-secret');
            req.user = decoded;
        } catch (e) {}
    }
    next();
});
app.use('/api/orders', ordersRouter);

const JWT_SECRET = 'dev-secret';
const testToken = jwt.sign({ id: 'user-list-test', username: 'testuser' }, JWT_SECRET);

describe('Orders List API', () => {
    beforeAll(async () => {
        await initializeDatabase();
        // Clear orders
        await run("DELETE FROM orders");
        
        const commonFields = "user_id, order_number, train_number, price, train_info, passenger_info";
        const trainInfo = JSON.stringify({fromStationId:"SHH", toStationId:"BJN", travelDate:"2025-12-25"});
        const passengerInfo = JSON.stringify([{name:"Test User"}]);
        
        // 1. Unpaid order
        await run(`INSERT INTO orders (id, status, ${commonFields}, created_at) VALUES 
            ('ord-unpaid', '未支付', 'user-list-test', 'ORD001', 'G1', 100, ?, ?, CURRENT_TIMESTAMP)`, 
            [trainInfo, passengerInfo]);
            
        // 2. Upcoming order (Paid)
        await run(`INSERT INTO orders (id, status, ${commonFields}, created_at) VALUES 
            ('ord-upcoming', '已支付', 'user-list-test', 'ORD002', 'G2', 200, ?, ?, CURRENT_TIMESTAMP)`, 
            [trainInfo, passengerInfo]);

        // 3. History order (Completed)
        await run(`INSERT INTO orders (id, status, ${commonFields}, created_at) VALUES 
            ('ord-history', '已完成', 'user-list-test', 'ORD003', 'G3', 300, ?, ?, '2024-01-01 00:00:00')`, 
            [trainInfo, passengerInfo]);

        // 4. Refunded order (History)
        await run(`INSERT INTO orders (id, status, ${commonFields}, created_at) VALUES 
            ('ord-refunded', '已退票', 'user-list-test', 'ORD004', 'G4', 400, ?, ?, '2024-01-01 00:00:00')`, 
            [trainInfo, passengerInfo]);
            
        // 5. Other user's order
        await run(`INSERT INTO orders (id, status, ${commonFields}, created_at) VALUES 
            ('ord-other', '已支付', 'other-user', 'ORD005', 'G5', 500, ?, ?, CURRENT_TIMESTAMP)`, 
            [trainInfo, passengerInfo]);
    });

    test('GET /api/orders?status=0 (Unpaid) returns unpaid orders', async () => {
        const res = await request(app)
            .get('/api/orders?status=0')
            .set('Authorization', `Bearer ${testToken}`);
        
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].id).toBe('ord-unpaid');
    });

    test('GET /api/orders?status=1 (Upcoming) returns paid orders', async () => {
        const res = await request(app)
            .get('/api/orders?status=1')
            .set('Authorization', `Bearer ${testToken}`);
        
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].id).toBe('ord-upcoming');
    });

    test('GET /api/orders?status=2 (History) returns completed and refunded orders', async () => {
        const res = await request(app)
            .get('/api/orders?status=2')
            .set('Authorization', `Bearer ${testToken}`);
        
        expect(res.status).toBe(200);
        const ids = res.body.data.map(o => o.id);
        expect(ids).toContain('ord-history');
        expect(ids).toContain('ord-refunded');
        expect(ids).not.toContain('ord-upcoming');
    });
    
    test('GET /api/orders?q=ORD002 (Search) returns matching order', async () => {
         const res = await request(app)
            .get('/api/orders?status=1&q=ORD002')
            .set('Authorization', `Bearer ${testToken}`);
            
         expect(res.status).toBe(200);
         expect(res.body.data.length).toBe(1);
         expect(res.body.data[0].id).toBe('ord-upcoming');
    });

    test('Given 状态=待支付 When 查询订单列表 Then 返回待支付订单', async () => {
        const res = await request(app)
            .get('/api/orders')
            .query({ status: '待支付' })
            .set('Authorization', `Bearer ${testToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        res.body.data.forEach(o => expect(o.status).toBe('待支付'));
    });

    test('Given 状态=已支付 When 查询订单列表 Then 返回已支付订单', async () => {
        const res = await request(app)
            .get('/api/orders')
            .query({ status: '已支付' })
            .set('Authorization', `Bearer ${testToken}`);
        expect(res.status).toBe(200);
        res.body.data.forEach(o => expect(o.status).toBe('已支付'));
    });
});
