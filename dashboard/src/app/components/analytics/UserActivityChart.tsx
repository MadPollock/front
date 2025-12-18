import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartData } from '../../hooks/useChartData';
import { ChartContainer } from './ChartContainer';

export function UserActivityChart() {
  const { data, isLoading, error } = useChartData('users');

  return (
    <ChartContainer
      title="User Activity"
      description="Daily active and inactive users"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="active" fill="#ff4c00" />
          <Bar dataKey="inactive" fill="#ffb400" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}