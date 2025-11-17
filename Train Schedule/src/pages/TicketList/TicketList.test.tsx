import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TicketList } from './TicketList';

describe('TicketList interactions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls API when clicking G 高铁 checkbox', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ meta: { totalItems: 0, totalPages: 1, currentPage: 1, pageSize: 10 }, data: [] }) } as any);
    render(<TicketList />);
    const btn = await screen.findByLabelText('选择G');
    await user.click(btn);
    await new Promise(r => setTimeout(r, 700));
    expect(fetchSpy).toHaveBeenCalled();
    const url = String((fetchSpy.mock.calls[0] as any[])[0]);
    expect(url.includes('/api/v1/tickets?')).toBe(true);
    expect(url.includes('trainTypes=G')).toBe(true);
  });

  it('allows modifying date via date picker input', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ meta: { totalItems: 0, totalPages: 1, currentPage: 1, pageSize: 10 }, data: [] }) } as any);
    render(<TicketList />);
    const input = document.querySelector('input[aria-label="日期输入"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    await user.clear(input);
    await user.type(input, '2025-11-21');
    await new Promise(r => setTimeout(r, 700));
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('swaps from/to and triggers fetch', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ meta: { totalItems: 0, totalPages: 1, currentPage: 1, pageSize: 10 }, data: [] }) } as any);
    render(<TicketList />);
    const swap = document.querySelector('[aria-label="互换出发地和目的地"]') as HTMLButtonElement;
    expect(swap).toBeTruthy();
    await user.click(swap);
    await new Promise(r => setTimeout(r, 700));
    const calls = fetchSpy.mock.calls.map(args => String(args[0]));
    expect(calls.some(u => u.includes('fromStation=%E4%B8%8A%E6%B5%B7') && u.includes('toStation=%E5%8C%97%E4%BA%AC'))).toBe(true);
  });

  it('shows error state on invalid date input', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ meta: { totalItems: 0, totalPages: 1, currentPage: 1, pageSize: 10 }, data: [] }) } as any);
    render(<TicketList />);
    const input = document.querySelector('input[aria-label="日期输入"]') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '2025/11/21');
    await new Promise(r => setTimeout(r, 100));
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
  
});