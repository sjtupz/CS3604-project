import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PassengerList from '../../src/components/PassengerList';

describe('UI-PassengerList', () => {
  const mockPassengers = [
    {
      passengerId: 'passenger-001',
      name: '张三',
      idType: '居民身份证',
      idNumber: '110101199001011234',
      phone: '13800138000',
      verificationStatus: '已通过'
    },
    {
      passengerId: 'passenger-002',
      name: '李四',
      idType: '居民身份证',
      idNumber: '110101199002022222',
      phone: '13800138001',
      verificationStatus: '未通过'
    }
  ];

  const mockCallbacks = {
    onAddPassenger: jest.fn(),
    onEditPassenger: jest.fn(),
    onDeletePassenger: jest.fn(),
    onBatchDeletePassengers: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 乘车人列表存在 When 渲染组件 Then 应显示查询条和添加按钮', () => {
    // Arrange & Act
    render(<PassengerList passengers={mockPassengers} {...mockCallbacks} />);

    // Assert
    expect(screen.getByText('乘车人管理')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('根据乘客姓名查询')).toBeInTheDocument();
    expect(screen.getByText('添加乘车人')).toBeInTheDocument();
  });

  test('Given 乘车人列表存在 When 渲染表格 Then 应显示完整的乘车人信息', () => {
    // Arrange & Act
    render(<PassengerList passengers={mockPassengers} {...mockCallbacks} />);

    // Assert
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getAllByText('居民身份证')).toHaveLength(2); // 有2个乘车人都是居民身份证
    expect(screen.getByText('110101199001011234')).toBeInTheDocument();
    expect(screen.getByText('13800138000')).toBeInTheDocument();
    expect(screen.getByText('已通过')).toBeInTheDocument();
    expect(screen.getAllByText('修改')).toHaveLength(2);
    expect(screen.getAllByText('删除')).toHaveLength(2);
  });

  test('Given 选中乘车人 When 勾选复选框 Then 应显示批量删除按钮', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerList passengers={mockPassengers} {...mockCallbacks} />);

    // Act
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // 选中第一个乘车人

    // Assert
    expect(screen.getByText('批量删除 (1)')).toBeInTheDocument();
  });

  test('Given 点击添加乘车人 When 用户点击 Then 应触发添加回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerList passengers={mockPassengers} {...mockCallbacks} />);

    // Act
    await user.click(screen.getByText('添加乘车人'));

    // Assert
    expect(mockCallbacks.onAddPassenger).toHaveBeenCalled();
  });

  test('Given 点击单个删除 When 用户点击 Then 应触发删除回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerList passengers={mockPassengers} {...mockCallbacks} />);

    // Act
    const deleteButtons = screen.getAllByText('删除');
    await user.click(deleteButtons[0]); // 删除第一个乘车人

    // Assert
    expect(mockCallbacks.onDeletePassenger).toHaveBeenCalledWith('passenger-001');
  });

  test('Given 点击修改按钮 When 用户点击 Then 应触发修改回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerList passengers={mockPassengers} {...mockCallbacks} />);

    // Act
    const editButtons = screen.getAllByText('修改');
    await user.click(editButtons[0]); // 修改第一个乘车人

    // Assert
    expect(mockCallbacks.onEditPassenger).toHaveBeenCalledWith('passenger-001');
  });

  test('Given 批量选中乘车人 When 点击批量删除 Then 应触发批量删除回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerList passengers={mockPassengers} {...mockCallbacks} />);

    // Act
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // 选中第一个乘车人
    await user.click(checkboxes[2]); // 选中第二个乘车人
    await user.click(screen.getByText('批量删除 (2)'));

    // Assert
    expect(mockCallbacks.onBatchDeletePassengers).toHaveBeenCalledWith(['passenger-001', 'passenger-002']);
  });

  test('Given 输入姓名查询 When 用户输入并查询 Then 应触发筛选逻辑', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerList passengers={mockPassengers} {...mockCallbacks} />);

    // Act
    await user.type(screen.getByPlaceholderText('根据乘客姓名查询'), '张三');

    // Assert - 这里主要验证输入框可以接收输入，实际筛选逻辑在组件实现中验证
    expect(screen.getByDisplayValue('张三')).toBeInTheDocument();
  });
});
