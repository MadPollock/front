import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartData } from '../../hooks/useChartData';
import { ChartContainer } from './ChartContainer';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { useChartThemeConfig, getChartColors } from '../../store/userPreferences';
import { useStrings } from '../../hooks/useStrings';

export function RevenueChart() {
  const { t } = useStrings();
  const { data, isLoading, error, refetch } = useChartData('revenue-monthly', {
    dataSource: 'api',
    refreshInterval: 30000, // Auto-refresh every 30 seconds
  });
  
  // Get user's chart theme preference (UX State - separate from data)
  const chartTheme = useChartThemeConfig();
  const colors = getChartColors(chartTheme);

  return (
    <ChartContainer
      title={t('charts.revenue.title')}
      description={t('charts.revenue.description')}
      isLoading={isLoading}
      error={error}
      actions={
        <Button variant="ghost" size="icon" onClick={refetch}>
          <RefreshCw className="size-4" />
        </Button>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Using brand orange and yellow colors */}
          <Line type="monotone" dataKey="revenue" stroke="#ff4c00" strokeWidth={2} />
          <Line type="monotone" dataKey="expenses" stroke="#ffb400" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
