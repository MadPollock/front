import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartData } from '../../hooks/useChartData';
import { ChartContainer } from './ChartContainer';

export function TransactionChart() {
  const { data, isLoading, error } = useChartData('transactions');

  return (
    <ChartContainer
      title="Transaction Volume"
      description="Hourly transaction count"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4c00" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ff4c00" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke="#ff4c00" fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}