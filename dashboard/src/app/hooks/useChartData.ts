import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface UseChartDataOptions {
  dataSource?: 'api' | 'mock';
  refreshInterval?: number;
  queryParams?: Record<string, string | number>;
  endpoint?: string;
}

/**
 * Custom hook for fetching chart data following CQRS read pattern.
 * Separates data fetching logic from presentation components.
 */
export function useChartData<T extends ChartDataPoint>(
  chartId: string,
  options: UseChartDataOptions = {}
) {
  const { dataSource = 'mock', refreshInterval, queryParams, endpoint } = options;
  const { getAccessToken, user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const readApiBase = import.meta.env?.VITE_READ_API_URL;
      const urlBase = endpoint || (readApiBase ? `${readApiBase.replace(/\/$/, '')}/${chartId}` : null);

      // Prefer API reads when configured; fallback to mock data otherwise
      if (dataSource === 'api' && urlBase) {
        const url = new URL(urlBase);
        if (queryParams) {
          Object.entries(queryParams).forEach(([key, value]) => {
            url.searchParams.set(key, String(value));
          });
        }

        if (user?.id) {
          url.searchParams.set('userId', user.id);
        }

        const token = await getAccessToken();
        if (!token) {
          throw new Error('Missing access token for read query');
        }

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-role': user?.role || '',
            'x-user-metadata': JSON.stringify(user?.metadata ?? {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Read query failed with status ${response.status}`);
        }

        const body = await response.json();
        setData((body?.data as T[]) ?? (body as T[]));
        return;
      }

      // Mock fallback
      if (dataSource === 'mock' || !urlBase) {
        if (dataSource === 'api' && !urlBase) {
          console.warn('VITE_READ_API_URL not configured, serving mock data for', chartId);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = generateMockData(chartId);
        setData(mockData as T[]);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [chartId, dataSource, endpoint, getAccessToken, queryParams, user?.id, user?.metadata, user?.role]);

  useEffect(() => {
    fetchData();

    if (refreshInterval) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return { data, isLoading, error, refetch: fetchData };
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
