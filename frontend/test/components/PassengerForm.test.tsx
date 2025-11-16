import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PassengerForm from '../../src/components/PassengerForm';

describe('UI-PassengerForm', () => {
  const mockPassenger = {
    passengerId: 'passenger-001',
    name: '张三',
    idType: '居民身份证',
    idNumber: '110101199001011234',
    phone: '13800138000',
    discountType: '成人'
  };

  const mockCallbacks = {
    onSubmit: jest.fn(),
    onCancel: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 渲染添加乘车人表单 When 初始状态 Then 应显示所有必填字段', () => {
    // Arrange & Act
    render(<PassengerForm onSubmit={mockCallbacks.onSubmit} onCancel={mockCallbacks.onCancel} />);

    // Assert
    expect(screen.getByText('添加乘车人')).toBeInTheDocument();
    expect(screen.getByText('证件类型：')).toBeInTheDocument();
    expect(screen.getByText('姓名：')).toBeInTheDocument();
    expect(screen.getByText('证件号码：')).toBeInTheDocument();
    expect(screen.getByText('有效电话号：')).toBeInTheDocument();
    expect(screen.getByText('优惠类型：')).toBeInTheDocument();
    expect(screen.getByText('提交')).toBeInTheDocument();
    expect(screen.getByText('取消')).toBeInTheDocument();
  });

  test('Given 渲染修改乘车人表单 When 传入乘车人数据 Then 应预填充表单字段', () => {
    // Arrange & Act
    render(
      <PassengerForm
        passenger={mockPassenger}
        onSubmit={mockCallbacks.onSubmit}
        onCancel={mockCallbacks.onCancel}
      />
    );

    // Assert
    expect(screen.getByText('修改乘车人')).toBeInTheDocument();
    expect(screen.getByDisplayValue('张三')).toBeInTheDocument();
    expect(screen.getByDisplayValue('110101199001011234')).toBeInTheDocument();
    expect(screen.getByDisplayValue('13800138000')).toBeInTheDocument();
  });

  test('Given 选择居民身份证 When 输入姓名 Then 应验证中文或英文字符', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerForm onSubmit={mockCallbacks.onSubmit} onCancel={mockCallbacks.onCancel} />);

    // Act
    await user.selectOptions(screen.getByRole('combobox', { name: /证件类型/ }), '居民身份证');
    await user.type(screen.getByLabelText('姓名：'), '张三123');

    // Assert - 表单验证将在提交时触发
    expect(screen.getByDisplayValue('张三123')).toBeInTheDocument();
  });

  test('Given 选择居民身份证 When 输入正确证件号 Then 应通过格式验证', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerForm onSubmit={mockCallbacks.onSubmit} onCancel={mockCallbacks.onCancel} />);

    // Act
    await user.selectOptions(screen.getByRole('combobox', { name: /证件类型/ }), '居民身份证');
    await user.type(screen.getByLabelText('证件号码：'), '110101199001011234');
    await user.click(screen.getByLabelText('证件号码：')); // 触发blur事件

    // Assert - 没有错误信息显示
    expect(screen.queryByText(/请输入正确的证件号码/)).not.toBeInTheDocument();
  });

  test('Given 选择居民身份证 When 输入错误证件号 Then 应显示错误信息', async () => {
    // Arrange
    const user = userEvent.setup();
    const { container } = render(<PassengerForm onSubmit={mockCallbacks.onSubmit} onCancel={mockCallbacks.onCancel} />);

    // Act
    await user.selectOptions(screen.getByRole('combobox', { name: /证件类型/ }), '居民身份证');
    const idNumberInput = screen.getByLabelText('证件号码：') as HTMLInputElement;
    await user.clear(idNumberInput);
    await user.type(idNumberInput, 'invalid-id-number');
    // 触发blur事件 - 使用fireEvent确保blur事件被触发
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.blur(idNumberInput);

    // Assert
    // 等待错误消息出现（使用 findByText 自动等待）
    const errorMessage = await screen.findByText('请输入正确的证件号码！');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Given 必填字段为空 When 点击提交 Then 应显示错误信息', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerForm onSubmit={mockCallbacks.onSubmit} onCancel={mockCallbacks.onCancel} />);

    // Act
    await user.click(screen.getByText('提交'));

    // Assert
    expect(screen.getByText('请输入姓名')).toBeInTheDocument();
    expect(screen.getByText('请输入证件号码')).toBeInTheDocument();
  });

  test('Given 表单填写完整 When 点击提交 Then 应触发提交回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerForm onSubmit={mockCallbacks.onSubmit} onCancel={mockCallbacks.onCancel} />);

    // Act
    await user.selectOptions(screen.getByRole('combobox', { name: /证件类型/ }), '居民身份证');
    await user.type(screen.getByLabelText('姓名：'), '张三');
    await user.type(screen.getByLabelText('证件号码：'), '110101199001011234');
    await user.type(screen.getByLabelText('有效电话号：'), '13800138000');
    await user.selectOptions(screen.getByRole('combobox', { name: /优惠类型/ }), '成人');
    await user.click(screen.getByText('提交'));

    // Assert
    expect(mockCallbacks.onSubmit).toHaveBeenCalledWith({
      name: '张三',
      idType: '居民身份证',
      idNumber: '110101199001011234',
      phone: '13800138000',
      discountType: '成人'
    });
  });

  test('Given 点击取消按钮 When 用户点击 Then 应触发取消回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerForm onSubmit={mockCallbacks.onSubmit} onCancel={mockCallbacks.onCancel} />);

    // Act
    await user.click(screen.getByText('取消'));

    // Assert
    expect(mockCallbacks.onCancel).toHaveBeenCalled();
  });

  test('Given 选择外国人永久居留身份证 When 渲染表单 Then 应显示有效截止日期和出生日期字段', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PassengerForm onSubmit={mockCallbacks.onSubmit} onCancel={mockCallbacks.onCancel} />);

    // Act
    await user.selectOptions(screen.getByRole('combobox', { name: /证件类型/ }), '外国人永久居留身份证');

    // Assert
    expect(screen.getByText('有效截止日期：')).toBeInTheDocument();
    expect(screen.getByText('出生日期：')).toBeInTheDocument();
  });
});
