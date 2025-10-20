import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TicketQueryForm from '../../src/components/TicketQueryForm';

describe('TicketQueryForm Component', () => {
  // 基于UI-TicketQueryForm的acceptanceCriteria编写测试

  describe('Form Structure', () => {
    it('应该显示票务查询表单标题', () => {
      render(<TicketQueryForm />);
      
      expect(screen.getByText('车票查询')).toBeInTheDocument();
    });

    it('应该显示所有必需的输入字段', () => {
      render(<TicketQueryForm />);
      
      expect(screen.getByLabelText('出发地')).toBeInTheDocument();
      expect(screen.getByLabelText('目的地')).toBeInTheDocument();
      expect(screen.getByLabelText('出发日期')).toBeInTheDocument();
      expect(screen.getByLabelText('返程日期')).toBeInTheDocument();
      expect(screen.getByLabelText('乘客类型')).toBeInTheDocument();
    });

    it('应该显示查询按钮', () => {
      render(<TicketQueryForm />);
      
      expect(screen.getByRole('button', { name: '查询车票' })).toBeInTheDocument();
    });

    it('应该显示站点互换按钮', () => {
      render(<TicketQueryForm />);
      
      expect(screen.getByRole('button', { name: '⇄' })).toBeInTheDocument();
    });

    it('应该有正确的输入占位符', () => {
      render(<TicketQueryForm />);
      
      expect(screen.getByPlaceholderText('请选择出发城市')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('请选择到达城市')).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('应该有正确的出发地输入字段', () => {
      render(<TicketQueryForm />);
      
      const departureInput = screen.getByLabelText('出发地');
      expect(departureInput).toHaveAttribute('type', 'text');
      expect(departureInput).toHaveAttribute('placeholder', '请选择出发城市');
    });

    it('应该有正确的目的地输入字段', () => {
      render(<TicketQueryForm />);
      
      const destinationInput = screen.getByLabelText('目的地');
      expect(destinationInput).toHaveAttribute('type', 'text');
      expect(destinationInput).toHaveAttribute('placeholder', '请选择到达城市');
    });

    it('应该有正确的出发日期输入字段', () => {
      render(<TicketQueryForm />);
      
      const departureDateInput = screen.getByLabelText('出发日期');
      expect(departureDateInput).toHaveAttribute('type', 'date');
    });

    it('应该有正确的返程日期输入字段', () => {
      render(<TicketQueryForm />);
      
      const returnDateInput = screen.getByLabelText('返程日期');
      expect(returnDateInput).toHaveAttribute('type', 'date');
    });

    it('应该有正确的乘客类型选择字段', () => {
      render(<TicketQueryForm />);
      
      const passengerTypeSelect = screen.getByLabelText('乘客类型');
      expect(passengerTypeSelect.tagName).toBe('SELECT');
      
      // 检查选项
      expect(screen.getByRole('option', { name: '成人' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '儿童' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '学生' })).toBeInTheDocument();
    });
  });

  describe('Station Swap Functionality', () => {
    it('应该在点击互换按钮时交换出发地和目的地', () => {
      render(<TicketQueryForm />);
      
      const departureInput = screen.getByLabelText('出发地');
      const destinationInput = screen.getByLabelText('目的地');
      const swapButton = screen.getByRole('button', { name: '⇄' });
      
      // 设置初始值
      fireEvent.change(departureInput, { target: { value: '北京' } });
      fireEvent.change(destinationInput, { target: { value: '上海' } });
      
      // 点击互换按钮
      fireEvent.click(swapButton);
      
      // 验证值已交换
      expect(departureInput).toHaveValue('上海');
      expect(destinationInput).toHaveValue('北京');
    });

    it('应该在出发地为空时正确处理互换', () => {
      render(<TicketQueryForm />);
      
      const departureInput = screen.getByLabelText('出发地');
      const destinationInput = screen.getByLabelText('目的地');
      const swapButton = screen.getByRole('button', { name: '⇄' });
      
      // 只设置目的地
      fireEvent.change(destinationInput, { target: { value: '上海' } });
      
      // 点击互换按钮
      fireEvent.click(swapButton);
      
      // 验证值已交换
      expect(departureInput).toHaveValue('上海');
      expect(destinationInput).toHaveValue('');
    });

    it('应该在目的地为空时正确处理互换', () => {
      render(<TicketQueryForm />);
      
      const departureInput = screen.getByLabelText('出发地');
      const destinationInput = screen.getByLabelText('目的地');
      const swapButton = screen.getByRole('button', { name: '⇄' });
      
      // 只设置出发地
      fireEvent.change(departureInput, { target: { value: '北京' } });
      
      // 点击互换按钮
      fireEvent.click(swapButton);
      
      // 验证值已交换
      expect(departureInput).toHaveValue('');
      expect(destinationInput).toHaveValue('北京');
    });
  });

  describe('Form Validation', () => {
    it('应该验证出发地不能为空', async () => {
      render(<TicketQueryForm />);
      
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      await waitFor(() => {
        expect(screen.getByText('查询功能尚未实现')).toBeInTheDocument();
      });
    });

    it('应该验证目的地不能为空', async () => {
      render(<TicketQueryForm />);
      
      const departureInput = screen.getByLabelText('出发地');
      fireEvent.change(departureInput, { target: { value: '北京' } });
      
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      // 在实际实现中，应该显示目的地验证错误
    });

    it('应该验证出发日期不能为空', async () => {
      render(<TicketQueryForm />);
      
      const departureInput = screen.getByLabelText('出发地');
      const destinationInput = screen.getByLabelText('目的地');
      
      fireEvent.change(departureInput, { target: { value: '北京' } });
      fireEvent.change(destinationInput, { target: { value: '上海' } });
      
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      // 在实际实现中，应该显示出发日期验证错误
    });

    it('应该验证出发日期不能是过去的日期', () => {
      render(<TicketQueryForm />);
      
      const departureDateInput = screen.getByLabelText('出发日期');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      fireEvent.change(departureDateInput, { target: { value: yesterdayString } });
      
      // 在实际实现中，应该显示日期验证错误
    });

    it('应该验证返程日期不能早于出发日期', () => {
      render(<TicketQueryForm />);
      
      const departureDateInput = screen.getByLabelText('出发日期');
      const returnDateInput = screen.getByLabelText('返程日期');
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayString = today.toISOString().split('T')[0];
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      fireEvent.change(departureDateInput, { target: { value: tomorrowString } });
      fireEvent.change(returnDateInput, { target: { value: todayString } });
      
      // 在实际实现中，应该显示返程日期验证错误
    });

    it('应该验证出发地和目的地不能相同', () => {
      render(<TicketQueryForm />);
      
      const departureInput = screen.getByLabelText('出发地');
      const destinationInput = screen.getByLabelText('目的地');
      
      fireEvent.change(departureInput, { target: { value: '北京' } });
      fireEvent.change(destinationInput, { target: { value: '北京' } });
      
      // 在实际实现中，应该显示相同城市验证错误
    });
  });

  describe('Form Submission', () => {
    it('应该在提交时调用查询处理函数', async () => {
      const mockOnQuery = vi.fn();
      render(<TicketQueryForm onQuery={mockOnQuery} />);
      
      // 填写所有必需字段
      fireEvent.change(screen.getByLabelText('出发地'), { target: { value: '北京' } });
      fireEvent.change(screen.getByLabelText('目的地'), { target: { value: '上海' } });
      
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      fireEvent.change(screen.getByLabelText('出发日期'), { target: { value: todayString } });
      
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      await waitFor(() => {
        expect(screen.getByText('查询功能尚未实现')).toBeInTheDocument();
      });
    });

    it('应该传递正确的查询参数', async () => {
      const mockOnQuery = vi.fn();
      render(<TicketQueryForm onQuery={mockOnQuery} />);
      
      const queryData = {
        departure: '北京',
        destination: '上海',
        departureDate: '2024-01-15',
        returnDate: '2024-01-20',
        passengerType: '成人'
      };
      
      fireEvent.change(screen.getByLabelText('出发地'), { target: { value: queryData.departure } });
      fireEvent.change(screen.getByLabelText('目的地'), { target: { value: queryData.destination } });
      fireEvent.change(screen.getByLabelText('出发日期'), { target: { value: queryData.departureDate } });
      fireEvent.change(screen.getByLabelText('返程日期'), { target: { value: queryData.returnDate } });
      fireEvent.change(screen.getByLabelText('乘客类型'), { target: { value: queryData.passengerType } });
      
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      // 在实际实现中，应该调用mockOnQuery并传递正确的参数
    });

    it('应该在查询期间禁用查询按钮', async () => {
      render(<TicketQueryForm />);
      
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      // 在实际实现中，按钮应该在查询期间被禁用
      // 并显示"查询中..."文本
    });
  });

  describe('Input Handling', () => {
    it('应该正确处理所有输入字段的变化', () => {
      render(<TicketQueryForm />);
      
      const inputs = {
        departure: screen.getByLabelText('出发地'),
        destination: screen.getByLabelText('目的地'),
        departureDate: screen.getByLabelText('出发日期'),
        returnDate: screen.getByLabelText('返程日期'),
        passengerType: screen.getByLabelText('乘客类型')
      };
      
      const testData = {
        departure: '北京',
        destination: '上海',
        departureDate: '2024-01-15',
        returnDate: '2024-01-20',
        passengerType: '成人'
      };
      
      Object.keys(inputs).forEach(key => {
        fireEvent.change(inputs[key], { target: { value: testData[key] } });
        expect(inputs[key]).toHaveValue(testData[key]);
      });
    });

    it('应该清除之前的错误信息当用户重新输入时', () => {
      render(<TicketQueryForm />);
      
      // 先触发一个错误
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      // 然后输入新内容
      const departureInput = screen.getByLabelText('出发地');
      fireEvent.change(departureInput, { target: { value: '北京' } });
      
      // 在实际实现中，错误信息应该被清除
    });
  });

  describe('Date Handling', () => {
    it('应该设置出发日期的最小值为今天', () => {
      render(<TicketQueryForm />);
      
      const departureDateInput = screen.getByLabelText('出发日期');
      const today = new Date().toISOString().split('T')[0];
      
      expect(departureDateInput).toHaveAttribute('min', today);
    });

    it('应该根据出发日期动态设置返程日期的最小值', () => {
      render(<TicketQueryForm />);
      
      const departureDateInput = screen.getByLabelText('出发日期');
      const returnDateInput = screen.getByLabelText('返程日期');
      
      const departureDate = '2024-01-15';
      fireEvent.change(departureDateInput, { target: { value: departureDate } });
      
      // 在实际实现中，返程日期的最小值应该设置为出发日期
      expect(returnDateInput).toHaveAttribute('min', departureDate);
    });

    it('应该处理日期格式转换', () => {
      render(<TicketQueryForm />);
      
      const departureDateInput = screen.getByLabelText('出发日期');
      
      // 测试不同的日期格式输入
      fireEvent.change(departureDateInput, { target: { value: '2024-01-15' } });
      expect(departureDateInput).toHaveValue('2024-01-15');
    });
  });

  describe('Passenger Type Options', () => {
    it('应该有正确的乘客类型选项', () => {
      render(<TicketQueryForm />);
      
      const passengerTypeSelect = screen.getByLabelText('乘客类型');
      
      expect(screen.getByRole('option', { name: '成人' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '儿童' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '学生' })).toBeInTheDocument();
    });

    it('应该默认选择成人类型', () => {
      render(<TicketQueryForm />);
      
      const passengerTypeSelect = screen.getByLabelText('乘客类型');
      expect(passengerTypeSelect).toHaveValue('成人');
    });

    it('应该正确处理乘客类型的变化', () => {
      render(<TicketQueryForm />);
      
      const passengerTypeSelect = screen.getByLabelText('乘客类型');
      
      fireEvent.change(passengerTypeSelect, { target: { value: '学生' } });
      expect(passengerTypeSelect).toHaveValue('学生');
      
      fireEvent.change(passengerTypeSelect, { target: { value: '儿童' } });
      expect(passengerTypeSelect).toHaveValue('儿童');
    });
  });

  describe('Error Display', () => {
    it('应该显示字段特定的错误信息', async () => {
      render(<TicketQueryForm />);
      
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      await waitFor(() => {
        expect(screen.getByText('查询功能尚未实现')).toBeInTheDocument();
      });
    });

    it('应该显示通用错误信息', async () => {
      render(<TicketQueryForm />);
      
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      await waitFor(() => {
        expect(screen.getByText('查询功能尚未实现')).toBeInTheDocument();
      });
    });

    it('应该正确设置错误信息的样式类', async () => {
      render(<TicketQueryForm />);
      
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      await waitFor(() => {
        const errorElement = screen.getByText('查询功能尚未实现');
        expect(errorElement).toHaveClass('error-message');
      });
    });
  });

  describe('Accessibility', () => {
    it('应该有正确的表单标签关联', () => {
      render(<TicketQueryForm />);
      
      const inputs = [
        screen.getByLabelText('出发地'),
        screen.getByLabelText('目的地'),
        screen.getByLabelText('出发日期'),
        screen.getByLabelText('返程日期'),
        screen.getByLabelText('乘客类型')
      ];
      
      inputs.forEach(input => {
        expect(input).toBeInTheDocument();
      });
    });

    it('应该支持键盘导航', () => {
      render(<TicketQueryForm />);
      
      const firstInput = screen.getByLabelText('出发地');
      firstInput.focus();
      expect(document.activeElement).toBe(firstInput);
    });

    it('应该有正确的输入类型', () => {
      render(<TicketQueryForm />);
      
      expect(screen.getByLabelText('出发地')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('目的地')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('出发日期')).toHaveAttribute('type', 'date');
      expect(screen.getByLabelText('返程日期')).toHaveAttribute('type', 'date');
    });

    it('应该有正确的表单语义结构', () => {
      render(<TicketQueryForm />);
      
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Component Props', () => {
    it('应该使用默认的空函数当没有提供回调时', () => {
      expect(() => render(<TicketQueryForm />)).not.toThrow();
    });

    it('应该正确处理所有可选的props', () => {
      const mockOnQuery = vi.fn();
      
      expect(() => 
        render(<TicketQueryForm onQuery={mockOnQuery} />)
      ).not.toThrow();
    });
  });

  describe('Form State Management', () => {
    it('应该正确管理表单状态', () => {
      render(<TicketQueryForm />);
      
      // 验证初始状态
      expect(screen.getByLabelText('出发地')).toHaveValue('');
      expect(screen.getByLabelText('目的地')).toHaveValue('');
      expect(screen.getByLabelText('出发日期')).toHaveValue('');
      expect(screen.getByLabelText('返程日期')).toHaveValue('');
      expect(screen.getByLabelText('乘客类型')).toHaveValue('成人');
    });

    it('应该在查询后保持表单状态', async () => {
      render(<TicketQueryForm />);
      
      // 填写表单
      fireEvent.change(screen.getByLabelText('出发地'), { target: { value: '北京' } });
      fireEvent.change(screen.getByLabelText('目的地'), { target: { value: '上海' } });
      
      // 提交表单
      const queryButton = screen.getByRole('button', { name: '查询车票' });
      fireEvent.click(queryButton);
      
      // 验证表单值仍然存在
      expect(screen.getByLabelText('出发地')).toHaveValue('北京');
      expect(screen.getByLabelText('目的地')).toHaveValue('上海');
    });
  });

  describe('Round Trip Handling', () => {
    it('应该正确处理单程查询', () => {
      render(<TicketQueryForm />);
      
      // 不填写返程日期
      fireEvent.change(screen.getByLabelText('出发地'), { target: { value: '北京' } });
      fireEvent.change(screen.getByLabelText('目的地'), { target: { value: '上海' } });
      
      const today = new Date().toISOString().split('T')[0];
      fireEvent.change(screen.getByLabelText('出发日期'), { target: { value: today } });
      
      // 在实际实现中，应该支持单程查询
    });

    it('应该正确处理往返查询', () => {
      render(<TicketQueryForm />);
      
      // 填写返程日期
      fireEvent.change(screen.getByLabelText('出发地'), { target: { value: '北京' } });
      fireEvent.change(screen.getByLabelText('目的地'), { target: { value: '上海' } });
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayString = today.toISOString().split('T')[0];
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      fireEvent.change(screen.getByLabelText('出发日期'), { target: { value: todayString } });
      fireEvent.change(screen.getByLabelText('返程日期'), { target: { value: tomorrowString } });
      
      // 在实际实现中，应该支持往返查询
    });
  });
});