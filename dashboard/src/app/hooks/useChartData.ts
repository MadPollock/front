import { useState, useEffect } from 'react';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface UseChartDataOptions {
  dataSource?: 'api' | 'mock';
  refreshInterval?: number;
}

/**
 * Custom hook for fetching chart data following CQRS read pattern.
 * Separates data fetching logic from presentation components.
 */
export function useChartData<T extends ChartDataPoint>(
  chartId: string,
  options: UseChartDataOptions = {}
) {
  const { dataSource = 'mock', refreshInterval } = options;
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In production, this would call your read-model API
        // Example: const response = await fetch(`/api/analytics/${chartId}`);
        
        if (dataSource === 'mock') {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Generate mock data based on chartId
          const mockData = generateMockData(chartId);
          setData(mockData as T[]);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up auto-refresh if specified
    if (refreshInterval) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [chartId, dataSource, refreshInterval]);

  return { data, isLoading, error, refetch: () => setIsLoading(true) };
}

// Mock data generator - in production, this comes from your read model database
function generateMockData(chartId: string): ChartDataPoint[] {
  switch (chartId) {
    case 'revenue':
      return [
        { name: 'Jan', value: 4000, revenue: 4000, expenses: 2400 },
        { name: 'Feb', value: 3000, revenue: 3000, expenses: 1398 },
        { name: 'Mar', value: 2000, revenue: 2000, expenses: 9800 },
        { name: 'Apr', value: 2780, revenue: 2780, expenses: 3908 },
        { name: 'May', value: 1890, revenue: 1890, expenses: 4800 },
        { name: 'Jun', value: 2390, revenue: 2390, expenses: 3800 },
        { name: 'Jul', value: 3490, revenue: 3490, expenses: 4300 },
      ];
    
    case 'users':
      return [
        { name: 'Mon', value: 120, active: 120, inactive: 40 },
        { name: 'Tue', value: 150, active: 150, inactive: 30 },
        { name: 'Wed', value: 180, active: 180, inactive: 25 },
        { name: 'Thu', value: 165, active: 165, inactive: 35 },
        { name: 'Fri', value: 190, active: 190, inactive: 20 },
        { name: 'Sat', value: 145, active: 145, inactive: 45 },
        { name: 'Sun', value: 135, active: 135, inactive: 50 },
      ];
    
    case 'transactions':
      return [
        { name: '00:00', value: 45 },
        { name: '04:00', value: 23 },
        { name: '08:00', value: 78 },
        { name: '12:00', value: 120 },
        { name: '16:00', value: 95 },
        { name: '20:00', value: 67 },
      ];
    
    default:
      return [
        { name: 'A', value: 100 },
        { name: 'B', value: 200 },
        { name: 'C', value: 150 },
      ];
  }
}
