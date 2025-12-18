export type QueryId = 'revenue-monthly' | 'user-activity-daily' | 'transactions-24h';

export interface QueryDefinition {
  id: QueryId;
  name: string;
  description: string;
  endpoint: string;
  defaultParams?: Record<string, string | number>;
  expectedParams?: Record<string, string>;
  responseShape?: {
    fields: string[];
    primaryValue?: string;
    notes?: string;
  };
}

const queryRegistry: Record<QueryId, QueryDefinition> = {
  'revenue-monthly': {
    id: 'revenue-monthly',
    name: 'Revenue Monthly',
    description: 'Monthly revenue and expenses grouped by month',
    endpoint: 'revenue',
    defaultParams: { scope: 'monthly' },
    expectedParams: {
      scope: 'monthly | quarterly',
      timezone: 'IANA timezone (optional)',
    },
    responseShape: {
      fields: ['name', 'revenue', 'expenses'],
      primaryValue: 'revenue',
    },
  },
  'user-activity-daily': {
    id: 'user-activity-daily',
    name: 'User Activity Daily',
    description: 'Active and inactive users per day',
    endpoint: 'users',
    defaultParams: { granularity: 'daily' },
    expectedParams: {
      granularity: 'daily | weekly',
    },
    responseShape: {
      fields: ['name', 'active', 'inactive'],
      primaryValue: 'active',
    },
  },
  'transactions-24h': {
    id: 'transactions-24h',
    name: 'Transactions 24h',
    description: 'Hourly transaction volume for the last 24 hours',
    endpoint: 'transactions',
    defaultParams: { range: '24h' },
    expectedParams: {
      range: '6h | 24h | 7d',
      timezone: 'IANA timezone (optional)',
    },
    responseShape: {
      fields: ['name', 'value'],
      primaryValue: 'value',
    },
  },
};

export function getQueryDefinition(queryId: QueryId): QueryDefinition {
  return queryRegistry[queryId];
}

export function listQueries() {
  return Object.values(queryRegistry);
}
