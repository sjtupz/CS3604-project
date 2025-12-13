
import type { Meta, StoryObj } from '@storybook/react';
import TicketList from '../TicketList';
import { TicketProvider } from '../../../context/TicketContext';

const meta: Meta<typeof TicketList> = {
  title: 'Features/TicketSearch/TicketList',
  component: TicketList,
  decorators: [
    (Story) => (
      <TicketProvider>
        <Story />
      </TicketProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TicketList>;

export const Default: Story = {
  render: () => <TicketList />,
};
