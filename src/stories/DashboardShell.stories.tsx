import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DashboardShell from '../components/DashboardShell';

// Mock router settings
const meta: Meta<typeof DashboardShell> = {
  title: 'EduVerse/DashboardShell',
  component: DashboardShell,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="bg-[#0A0A0F] text-white min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardShell>;

export const DefaultDashboard: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold">Storybook Mock Render View</h2>
          <p className="text-[#A0A0B8] mt-2">This is the student panel injected into the layout framework.</p>
        </div>
      </div>
    ),
  },
};
