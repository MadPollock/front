import React, { useState } from 'react';
import { RevenueChart } from '../components/analytics/RevenueChart';
import { UserActivityChart } from '../components/analytics/UserActivityChart';
import { TransactionChart } from '../components/analytics/TransactionChart';
import { ChevronDown, ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react';

// Mock recent transactions
const recentTransactions = [
  {
    id: 'tx_001',
    type: 'received' as const,
    amount: 'R$ 1.450,00',
    description: 'Payment from merchant #3421',
    time: '10m ago',
  },
  {
    id: 'tx_002',
    type: 'received' as const,
    amount: 'R$ 890,00',
    description: 'Payment from merchant #2891',
    time: '1h ago',
  },
  {
    id: 'tx_003',
    type: 'sent' as const,
    amount: 'R$ 2.500,00',
    description: 'Withdrawal to wallet',
    time: '5h ago',
  },
];

// Mobile-first Dashboard following private banking / neo-broker aesthetic
// Calm, trustworthy, spacing-based hierarchy

export function DashboardView() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Mobile-First: Primary Balance Section (Hero) - No card, spacing defines hierarchy */}
      <div className="space-y-2">
        <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
          Available balance
        </p>
        <p style={{ 
          fontFamily: 'Manrope', 
          fontSize: '32px', 
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: '-0.02em'
        }}>
          R$ 12.480,90
        </p>
        <div className="flex items-center gap-3 text-muted-foreground" style={{ fontSize: '12px' }}>
          <span>BRL · settles in USDT</span>
          <span className="size-1 bg-muted-foreground/40 rounded-full" />
          <span>Updated 2 min ago</span>
        </div>
      </div>

      {/* Primary Actions - Text-only buttons, flat */}
      <div className="flex items-center gap-3">
        <button className="flex-1 md:flex-none md:px-8 h-11 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
          Receive payment
        </button>
        <button className="flex-1 md:flex-none md:px-8 h-11 border border-border bg-card text-foreground rounded-xl hover:bg-muted/50 transition-colors">
          Withdraw
        </button>
      </div>

      {/* Today Snapshot Card - First and only prominent card */}
      <div className="bg-card rounded-2xl p-6 space-y-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: 'Manrope', fontSize: '18px', fontWeight: 500 }}>Today</h2>
          <button className="text-primary text-sm hover:underline">View details</button>
        </div>
        
        {/* Numeric rows - no visuals */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Payments received</span>
            <span style={{ fontFamily: 'Manrope', fontSize: '15px', fontWeight: 500 }}>R$ 3.240,00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Payments pending</span>
            <span style={{ fontFamily: 'Manrope', fontSize: '15px', fontWeight: 500 }}>R$ 580,00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Fees</span>
            <span style={{ fontFamily: 'Manrope', fontSize: '15px', fontWeight: 500 }}>R$ 42,15</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions - Mobile-First */}
      <div className="bg-card rounded-2xl p-6 space-y-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: 'Manrope', fontSize: '18px', fontWeight: 500 }}>Recent activity</h2>
          <button className="flex items-center gap-1 text-primary text-sm hover:underline">
            View all
            <ChevronRight className="size-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3">
              <div
                className={`size-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  tx.type === 'received' ? 'bg-foreground/5' : 'bg-muted'
                }`}
              >
                {tx.type === 'received' ? (
                  <ArrowDownLeft className="size-4 text-foreground" />
                ) : (
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.time}</p>
              </div>
              <p
                className={`font-medium ${
                  tx.type === 'received' ? 'text-foreground' : 'text-muted-foreground'
                }`}
                style={{ fontFamily: 'Manrope', fontSize: '14px' }}
              >
                {tx.type === 'received' ? '+' : '-'}{tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Status - Subtle, at-a-glance only */}
      <div className="bg-card rounded-2xl p-6 space-y-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontFamily: 'Manrope', fontSize: '18px', fontWeight: 500 }}>Payment status</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span style={{ fontFamily: 'Manrope', fontWeight: 500 }}>24</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-foreground/80 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span style={{ fontFamily: 'Manrope', fontWeight: 500 }}>6</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-muted-foreground/60 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics - Collapsed by default */}
      <div className="mx-4 md:mx-0">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 bg-card rounded-2xl hover:bg-muted/30 transition-colors"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <span style={{ fontFamily: 'Manrope', fontSize: '16px', fontWeight: 500 }}>
            Show advanced analytics
          </span>
          <ChevronDown className={`size-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {showAdvanced && (
          <div className="mt-6 space-y-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <UserActivityChart />
            </div>

            <div className="grid grid-cols-1">
              <TransactionChart />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}