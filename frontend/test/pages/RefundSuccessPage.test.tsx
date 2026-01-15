import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RefundSuccessPage from '../../src/pages/RefundSuccessPage';
import { describe, it, expect } from 'vitest';

describe('RefundSuccessPage', () => {
    it('renders refund details correctly with full data', () => {
        const refundData = {
            refundAmount: 85.5,
            refundFee: 14.5,
            originalPrice: 100.0,
            refundFeeRate: 0.2 // 20%
        };
        const orderInfo = {
            trainNumber: 'G1234',
            departureTime: '2023-10-01T10:00:00Z' // 2023年10月1日
        };

        render(
            <MemoryRouter initialEntries={[{ pathname: '/refund-success', state: { refundData, orderInfo } }]}>
                <Routes>
                    <Route path="/refund-success" element={<RefundSuccessPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/操作成功/)).toBeInTheDocument();
        // Check for formatted date (allow flexibility in local time if needed, but regex helps)
        expect(screen.getByText(/2023年10月/)).toBeInTheDocument();
        expect(screen.getByText(/G1234/)).toBeInTheDocument();
        expect(screen.getByText(/85.5/)).toBeInTheDocument();
        expect(screen.getByText(/100.0/)).toBeInTheDocument();
        expect(screen.getByText(/14.5/)).toBeInTheDocument();
        expect(screen.getAllByText(/按/)[0]).toBeInTheDocument();
        expect(screen.getByText(/20%/)).toBeInTheDocument();
        expect(screen.getByText(/收取退票手续费/)).toBeInTheDocument();
        
        expect(screen.getByRole('button', { name: /继续购票/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /查询订单详情/ })).toBeInTheDocument();
        
        // Check for tips
        expect(screen.getByText(/温馨提示/)).toBeInTheDocument();
        expect(screen.getByText(/线上完成退票后/)).toBeInTheDocument();
    });

    it('renders partial details when some data is missing', () => {
        const refundData = {
            refundAmount: 85.5
        };
        
        render(
            <MemoryRouter initialEntries={[{ pathname: '/refund-success', state: { refundData } }]}>
                <Routes>
                    <Route path="/refund-success" element={<RefundSuccessPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Should still render page structure
        expect(screen.getByText(/操作成功/)).toBeInTheDocument();
        expect(screen.getByText(/85.5/)).toBeInTheDocument();
        // Missing data placeholders
        expect(screen.getByText('----年--月--日')).toBeInTheDocument();
        
        // Use getAllByText because there might be multiple '----' or just be specific
        // Actually, getByText matches full text content by default if string is passed
        // But if '----' is inside a span, and another span has '----年...', strict equality helps.
        // However, '----' is distinct from '----年--月--日'.
        // Let's use getAllByText to be safe if multiple appear, or just check one.
        const placeholders = screen.getAllByText('----');
        expect(placeholders.length).toBeGreaterThan(0);
    });
});
