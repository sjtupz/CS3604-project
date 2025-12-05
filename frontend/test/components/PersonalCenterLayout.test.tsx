import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonalCenterLayout from '../../src/components/PersonalCenterLayout';
import { vi, describe, it, expect } from 'vitest';

// Mock subcomponents
vi.mock('../../src/components/PersonalCenterHome', () => ({
  default: () => <div data-testid="personal-center-home">Personal Center Home</div>
}));
vi.mock('../../src/components/OrderTabs', () => ({
  default: () => <div data-testid="order-tabs">Order Tabs</div>
}));
vi.mock('../../src/components/UncompletedOrders', () => ({
  default: () => <div>Uncompleted Orders</div>
}));
vi.mock('../../src/components/UpcomingOrders', () => ({
  default: () => <div>Upcoming Orders</div>
}));
vi.mock('../../src/components/HistoryOrders', () => ({
  default: () => <div>History Orders</div>
}));
vi.mock('../../src/components/UserInfoView', () => ({
  default: () => <div data-testid="user-info-view">User Info View</div>
}));
vi.mock('../../src/components/PassengerList', () => ({
  default: () => <div data-testid="passenger-list">Passenger List</div>
}));

describe('PersonalCenterLayout', () => {
  it('renders default content initially', () => {
    render(<PersonalCenterLayout />);
    expect(screen.getByTestId('personal-center-home')).toBeInTheDocument();
    
    // Check highlight via background color for Parent Item "个人中心"
    // #e6f7ff is rgb(230, 247, 255)
    const sidebarItem = screen.getByText('个人中心');
    expect(sidebarItem.closest('div')).toHaveStyle({ backgroundColor: 'rgb(230, 247, 255)' });
  });

  it('switches content and highlight when implemented section is clicked', () => {
    render(<PersonalCenterLayout />);
    
    // Click "火车票订单" (Subsection)
    fireEvent.click(screen.getByText('火车票订单'));
    
    expect(screen.getByTestId('order-tabs')).toBeInTheDocument();
    // Check highlight via color for Subsection
    // #1890ff is rgb(24, 144, 255)
    expect(screen.getByText('火车票订单').closest('div')).toHaveStyle({ color: 'rgb(24, 144, 255)' });
  });

  it('keeps content but changes highlight when unimplemented section is clicked', () => {
    render(<PersonalCenterLayout />);
    
    // First go to "火车票订单"
    fireEvent.click(screen.getByText('火车票订单'));
    expect(screen.getByTestId('order-tabs')).toBeInTheDocument();
    
    // Then click "会员中心" (Unimplemented Parent Item)
    fireEvent.click(screen.getByText('会员中心'));
    
    // Highlight should change to "会员中心" (Parent Item -> Background Color)
    expect(screen.getByText('会员中心').closest('div')).toHaveStyle({ backgroundColor: 'rgb(230, 247, 255)' });
    
    // "火车票订单" should no longer be highlighted (Subsection -> Color #666)
    // #666 is rgb(102, 102, 102)
    expect(screen.getByText('火车票订单').closest('div')).toHaveStyle({ color: 'rgb(102, 102, 102)' });
    
    // Content should stay "Order Tabs" (NOT Personal Center Home)
    expect(screen.getByTestId('order-tabs')).toBeInTheDocument();
    expect(screen.queryByTestId('personal-center-home')).not.toBeInTheDocument();
  });
});
