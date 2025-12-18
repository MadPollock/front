import React from 'react';
import { RevenueChart } from '../components/analytics/RevenueChart';
import { UserActivityChart } from '../components/analytics/UserActivityChart';
import { TransactionChart } from '../components/analytics/TransactionChart';

export function AnalyticsView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 style={{ fontFamily: 'Manrope' }}>Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights and trends from your payment data
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RevenueChart />
        <UserActivityChart />
        <TransactionChart />
      </div>
    </div>
  );
}