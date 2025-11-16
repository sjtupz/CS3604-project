import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryOrders from '../../src/components/HistoryOrders';

describe('UI-HistoryOrders', () => {
  const mockOrders = [
    {
      orderId: 'order-001',
      orderNumber: '1234567890',
      trainNumber: 'G108',
      passengerName: '张三',
      bookingDate: '2025-01-15',
      travelDate: '2025-01-16',
      trainInfo: '北京南-上海虹桥',
      passengerInfo: '张三(成人)',
      seatInfo: '02车厢 08A座',
      price: 553.0,
      status: '已完成'
    },
    {
      orderId: 'order-002',
      orderNumber: '0987654321',
      trainNumber: 'G109',
      passengerName: '李四',
      bookingDate: '2025-01-10',
      travelDate: '2025-01-12',
      trainInfo: '上海虹桥-北京南',
      passengerInfo: '李四(成人)',
      seatInfo: '03车厢 12B座',
      price: 553.0,
      status: '已完成'
    }
  ];

  const mockOnPrintInfo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 存在历史订单 When 渲染组件 Then 应显示查询功能，只能按照乘车日期进行查询', () => {
    // Arrange & Act
    render(
      <HistoryOrders
        orders={mockOrders}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Assert
    expect(screen.getAllByDisplayValue('').length).toBeGreaterThanOrEqual(2); // 日期输入框
    expect(screen.getByPlaceholderText('订单号/车次/姓名')).toBeInTheDocument();
    expect(screen.getByText(/查询/i)).toBeInTheDocument();
  });

  test('Given 存在历史订单 When 渲染组件 Then 应显示订单列表，格式与未出行订单相同', () => {
    // Arrange & Act
    render(
      <HistoryOrders
        orders={mockOrders}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Assert
    expect(screen.getByText('订票日期')).toBeInTheDocument();
    expect(screen.getByText('车次信息')).toBeInTheDocument();
    expect(screen.getByText('旅客信息')).toBeInTheDocument();
    expect(screen.getByText('席位信息')).toBeInTheDocument();
    expect(screen.getByText('票价')).toBeInTheDocument();
    expect(screen.getByText('车票状态')).toBeInTheDocument();
    expect(screen.getByText('操作')).toBeInTheDocument();
    
    // 验证订单数据
    expect(screen.getByText('G108')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('02车厢 08A座')).toBeInTheDocument();
    // 有多个订单价格都是553，使用getAllByText
    expect(screen.getAllByText(/553/).length).toBeGreaterThan(0);
    // 有多个订单状态都是"已完成"，使用getAllByText
    expect(screen.getAllByText('已完成').length).toBeGreaterThan(0);
  });

  test('Given 存在历史订单 When 渲染组件 Then 每个订单右侧应有"打印信息单"按钮', () => {
    // Arrange & Act
    render(
      <HistoryOrders
        orders={mockOrders}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Assert
    const printButtons = screen.getAllByText(/打印信息单/i);
    expect(printButtons.length).toBeGreaterThan(0);
    expect(printButtons[0]).toBeInTheDocument();
  });

  test('Given 存在历史订单 When 点击打印信息单按钮 Then 应调用onPrintInfo回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <HistoryOrders
        orders={mockOrders}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Act
    const printButtons = screen.getAllByText(/打印信息单/i);
    await user.click(printButtons[0]);

    // Assert
    expect(mockOnPrintInfo).toHaveBeenCalledWith('order-001');
  });

  test('Given 查询条件设置 When 点击查询按钮 Then 应根据查询条件更新订单列表', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <HistoryOrders
        orders={mockOrders}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Act
    const searchInput = screen.getByPlaceholderText('订单号/车次/姓名');
    await user.type(searchInput, '1234567890');
    
    const queryButton = screen.getByText(/查询/i);
    await user.click(queryButton);

    // Assert
    expect(screen.getByText('G108')).toBeInTheDocument();
    expect(screen.queryByText('G109')).not.toBeInTheDocument();
  });

  test('Given 查询条件设置（按车次） When 点击查询按钮 Then 应根据车次筛选订单', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <HistoryOrders
        orders={mockOrders}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Act
    const searchInput = screen.getByPlaceholderText('订单号/车次/姓名');
    await user.type(searchInput, 'G109');
    
    const queryButton = screen.getByText(/查询/i);
    await user.click(queryButton);

    // Assert
    expect(screen.getByText('G109')).toBeInTheDocument();
    expect(screen.queryByText('G108')).not.toBeInTheDocument();
  });

  test('Given 查询条件设置（按姓名） When 点击查询按钮 Then 应根据姓名筛选订单', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <HistoryOrders
        orders={mockOrders}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Act
    const searchInput = screen.getByPlaceholderText('订单号/车次/姓名');
    await user.type(searchInput, '李四');
    
    const queryButton = screen.getByText(/查询/i);
    await user.click(queryButton);

    // Assert
    expect(screen.getByText('李四')).toBeInTheDocument();
    expect(screen.queryByText('张三')).not.toBeInTheDocument();
  });

  test('Given 查询条件设置（按乘车日期范围） When 点击查询按钮 Then 应根据乘车日期筛选订单', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <HistoryOrders
        orders={mockOrders}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Act
    const startDateInput = screen.getAllByDisplayValue('')[0] as HTMLInputElement;
    const endDateInput = screen.getAllByDisplayValue('')[1] as HTMLInputElement;
    
    await user.type(startDateInput, '2025-01-15');
    await user.type(endDateInput, '2025-01-17');
    
    const queryButton = screen.getByText(/查询/i);
    await user.click(queryButton);

    // Assert
    expect(screen.getByText('G108')).toBeInTheDocument();
    expect(screen.queryByText('G109')).not.toBeInTheDocument();
  });

  test('Given 提示信息存在 When 渲染组件 Then 应显示提示信息："只保留三十天信息"', () => {
    // Arrange & Act
    render(
      <HistoryOrders
        orders={mockOrders}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Assert
    expect(screen.getByText(/提示：只保留三十天信息/i)).toBeInTheDocument();
  });

  test('Given 订单列表为空 When 渲染组件 Then 应显示空状态', () => {
    // Arrange & Act
    render(
      <HistoryOrders
        orders={[]}
        onPrintInfo={mockOnPrintInfo}
      />
    );

    // Assert
    expect(screen.getByText('订票日期')).toBeInTheDocument();
    expect(screen.getByText('车次信息')).toBeInTheDocument();
    // 表格头部应该存在，但tbody应该为空
  });
});

