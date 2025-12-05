import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PassengerList from '../../src/components/PassengerList';
import '@testing-library/jest-dom';

const mockPassengers = [
  {
    passengerId: '2',
    name: 'Other Person',
    idType: '中国居民身份证',
    idNumber: '330101199001015678',
    phone: '13800138000',
    verificationStatus: '已通过',
    isSelf: false
  },
  {
    passengerId: '1',
    name: 'Self Person',
    idType: '中国居民身份证',
    idNumber: '110101198001011234',
    phone: '13900139000',
    verificationStatus: '已通过',
    isSelf: true
  }
];

test('renders passenger list with correct sorting and masking', () => {
  render(<PassengerList passengers={mockPassengers} />);

  // Check sorting: Self Person should be first
  const names = screen.getAllByText(/Person/);
  expect(names[0]).toHaveTextContent('Self Person');
  expect(names[1]).toHaveTextContent('Other Person');

  // Check ID masking
  // 110101198001011234 -> 1101***********234
  expect(screen.getByText('1101***********234')).toBeInTheDocument();
  // 330101199001015678 -> 3301***********678
  expect(screen.getByText('3301***********678')).toBeInTheDocument();

  // Check Phone masking with (+86)
  // 13900139000 -> (+86)139****9000
  expect(screen.getByText('(+86)139****9000')).toBeInTheDocument();
  // 13800138000 -> (+86)138****8000
  expect(screen.getByText('(+86)138****8000')).toBeInTheDocument();
});

test('renders checkboxes', () => {
  render(<PassengerList passengers={mockPassengers} />);
  const checkboxes = screen.getAllByRole('checkbox');
  expect(checkboxes.length).toBeGreaterThan(0);
});
