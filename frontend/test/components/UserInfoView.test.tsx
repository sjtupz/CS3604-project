import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserInfoView from '../../src/components/UserInfoView';

describe('UI-UserInfoView', () => {
  const mockUserInfo = {
    username: 'zhangsan',
    realName: '张三',
    country: '中国',
    idType: '居民身份证',
    idNumber: '110101199001011234',
    verificationStatus: '已通过',
    phoneNumber: '13800138000',
    email: 'zhangsan@example.com',
    phoneVerified: true,
    discountType: '成人'
  };

  const mockCallbacks = {
    onEditContact: jest.fn(),
    onEditDiscountType: jest.fn(),
    onNavigateToPhoneVerification: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 用户信息存在 When 渲染查看个人信息 Then 应显示基本信息板块', () => {
    // Arrange & Act
    render(<UserInfoView userInfo={mockUserInfo} {...mockCallbacks} />);

    // Assert
    expect(screen.getByText('查看个人信息')).toBeInTheDocument();
    expect(screen.getByText('基本信息')).toBeInTheDocument();
    expect(screen.getByText('用户名:')).toBeInTheDocument();
    expect(screen.getByText('zhangsan')).toBeInTheDocument();
    expect(screen.getByText('姓名:')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
  });

  test('Given 联系方式板块存在 When 渲染组件 Then 应显示手机号和邮箱以及编辑按钮', () => {
    // Arrange & Act
    render(<UserInfoView userInfo={mockUserInfo} {...mockCallbacks} />);

    // Assert
    expect(screen.getByText('联系方式')).toBeInTheDocument();
    expect(screen.getByText('手机号:')).toBeInTheDocument();
    expect(screen.getByText('13800138000')).toBeInTheDocument();
    expect(screen.getByText('已通过核验')).toBeInTheDocument();
    // 有多个"编辑"按钮，使用getAllByText
    expect(screen.getAllByText('编辑').length).toBeGreaterThan(0);
  });

  test('Given 优惠类型板块存在 When 渲染组件 Then 应显示当前优惠类型和编辑按钮', () => {
    // Arrange & Act
    render(<UserInfoView userInfo={mockUserInfo} {...mockCallbacks} />);

    // Assert
    expect(screen.getByText('优惠类型')).toBeInTheDocument();
    expect(screen.getByText('当前优惠类型:')).toBeInTheDocument();
    expect(screen.getByText('成人')).toBeInTheDocument();
  });

  test('Given 联系方式已通过核验 When 点击编辑按钮 Then 应显示去手机核验修改链接', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<UserInfoView userInfo={mockUserInfo} {...mockCallbacks} />);

    // Act
    await user.click(screen.getAllByText('编辑')[0]); // 联系方式的编辑按钮

    // Assert
    expect(screen.getByText('去手机核验修改')).toBeInTheDocument();
  });

  test('Given 点击优惠类型编辑 When 用户点击 Then 应显示优惠类型选择下拉框', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<UserInfoView userInfo={mockUserInfo} {...mockCallbacks} />);

    // Act
    await user.click(screen.getAllByText('编辑')[1]); // 优惠类型的编辑按钮

    // Assert
    expect(screen.getByText('成人')).toBeInTheDocument();
    expect(screen.getByText('儿童')).toBeInTheDocument();
    expect(screen.getByText('学生')).toBeInTheDocument();
    expect(screen.getByText('残疾军人')).toBeInTheDocument();
  });

  test('Given 选择学生类型 When 完成编辑 Then 应显示学生资质查询板块', async () => {
    // Arrange
    const user = userEvent.setup();
    const studentUserInfo = { ...mockUserInfo, discountType: '学生' };
    render(<UserInfoView userInfo={studentUserInfo} {...mockCallbacks} />);

    // Assert - 学生资质查询板块应存在
    expect(screen.getByText('学生资质查询')).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    expect(screen.getByText('查询')).toBeInTheDocument();
  });
});
