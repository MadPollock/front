import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, ChevronDown } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { PaymentDetailsModal } from '../components/admin/PaymentDetailsModal';

// Mock transaction data
const mockTransactions = [
  {
    id: 'tx_001',
    type: 'received' as const,
    amount: 'R$ 1.450,00',
    amountUSD: '285.20 USDT',
    description: 'Payment from merchant #3421',
    status: 'completed' as const,
    date: '2025-12-16T10:30:00',
    fee: 'R$ 14,50',
    // Extended fields for modal
    createdAt: '2025-12-16T10:30:00',
    updatedAt: '2025-12-16T10:32:15',
    address: 'NOXD0F30710AFD24ED5B0O1C19BFA00C64F',
    checkoutUrl: 'https://checkout.crossramp.io/e2e/NOXD0F30710AFD24ED5B0O1C19BFA00C64F',
    template: 'fast_usdt_base',
    process: 'onramp',
    entryValue: '1450.00',
    entryCurrency: 'BRL',
    exitValue: '285.20',
    exitCurrency: 'USDT',
    effectiveRate: '5.08',
    baseRate: '5.08',
    clientId: '03476666006',
    externalId: '---',
    wallet: '0x91D8AAB34A1F54BE2E168A4266685b407102b819',
    txHash: '0x91D8AAB34A1F54BE2E168A4266685b407102b819',
    state: 'Completed',
    expirationDate: '2025-12-16T10:45:00',
    expired: false,
  },
  {
    id: 'tx_002',
    type: 'received' as const,
    amount: 'R$ 890,00',
    amountUSD: '175.00 USDT',
    description: 'Payment from merchant #2891',
    status: 'completed' as const,
    date: '2025-12-16T09:15:00',
    fee: 'R$ 8,90',
    createdAt: '2025-12-16T09:15:00',
    updatedAt: '2025-12-16T09:17:22',
    address: 'NOXE1G40820BFE35FC6C1D20CGFB11D75G',
    checkoutUrl: 'https://checkout.crossramp.io/e2e/NOXE1G40820BFE35FC6C1D20CGFB11D75G',
    template: 'standard_usdt_trx',
    process: 'onramp',
    entryValue: '890.00',
    entryCurrency: 'BRL',
    exitValue: '175.00',
    exitCurrency: 'USDT',
    effectiveRate: '5.09',
    baseRate: '5.08',
    clientId: '04587221893',
    externalId: 'ORD-2891',
    wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    txHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    state: 'Completed',
    expirationDate: '2025-12-16T09:30:00',
    expired: false,
  },
  {
    id: 'tx_003',
    type: 'sent' as const,
    amount: 'R$ 2.500,00',
    amountUSD: '491.80 USDT',
    description: 'Withdrawal to wallet 0x742d...a8c3',
    status: 'completed' as const,
    date: '2025-12-15T16:45:00',
    fee: 'R$ 25,00',
    createdAt: '2025-12-15T16:45:00',
    updatedAt: '2025-12-15T16:48:10',
    address: 'WITD2H51931CGF46GD7D2E31DHGC22E86H',
    checkoutUrl: '---',
    template: '---',
    process: 'offramp',
    entryValue: '491.80',
    entryCurrency: 'USDT',
    exitValue: '2500.00',
    exitCurrency: 'BRL',
    effectiveRate: '5.08',
    baseRate: '5.08',
    clientId: '03476666006',
    externalId: 'WIT-1234',
    wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEa8c3',
    txHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEa8c3',
    state: 'Completed',
    expirationDate: '---',
    expired: false,
  },
  {
    id: 'tx_004',
    type: 'received' as const,
    amount: 'R$ 340,00',
    amountUSD: '66.90 USDT',
    description: 'Payment from merchant #1654',
    status: 'pending' as const,
    date: '2025-12-15T14:20:00',
    fee: 'R$ 3,40',
    createdAt: '2025-12-15T14:20:00',
    updatedAt: '2025-12-15T14:20:00',
    address: 'NOXF2I62042DHG57HE8E3F42EIHD33F97I',
    checkoutUrl: 'https://checkout.crossramp.io/e2e/NOXF2I62042DHG57HE8E3F42EIHD33F97I',
    template: 'fast_usdt_base',
    process: 'onramp',
    entryValue: '340.00',
    entryCurrency: 'BRL',
    exitValue: '66.90',
    exitCurrency: 'USDT',
    effectiveRate: '5.08',
    baseRate: '5.08',
    clientId: '05698332114',
    externalId: '---',
    wallet: '---',
    txHash: '---',
    state: 'Pending',
    expirationDate: '2025-12-15T14:35:00',
    expired: false,
  },
  {
    id: 'tx_005',
    type: 'received' as const,
    amount: 'R$ 3.200,00',
    amountUSD: '629.40 USDT',
    description: 'Payment from merchant #4092',
    status: 'completed' as const,
    date: '2025-12-15T11:30:00',
    fee: 'R$ 32,00',
    createdAt: '2025-12-15T11:30:00',
    updatedAt: '2025-12-15T11:33:45',
    address: 'NOXG3J73153EIH68IF9F4G53FJIE44G08J',
    checkoutUrl: 'https://checkout.crossramp.io/e2e/NOXG3J73153EIH68IF9F4G53FJIE44G08J',
    template: 'premium_usdc_eth',
    process: 'onramp',
    entryValue: '3200.00',
    entryCurrency: 'BRL',
    exitValue: '629.40',
    exitCurrency: 'USDC',
    effectiveRate: '5.08',
    baseRate: '5.08',
    clientId: '06709443225',
    externalId: 'ORD-4092',
    wallet: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    txHash: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    state: 'Completed',
    expirationDate: '2025-12-15T11:45:00',
    expired: false,
  },
  {
    id: 'tx_006',
    type: 'sent' as const,
    amount: 'R$ 1.800,00',
    amountUSD: '354.10 USDT',
    description: 'Withdrawal to wallet 0x9a1f...2b4e',
    status: 'completed' as const,
    date: '2025-12-14T18:10:00',
    fee: 'R$ 18,00',
    createdAt: '2025-12-14T18:10:00',
    updatedAt: '2025-12-14T18:13:20',
    address: 'WITD4K84264FJI79JG0G5H64GKJF55H19K',
    checkoutUrl: '---',
    template: '---',
    process: 'offramp',
    entryValue: '354.10',
    entryCurrency: 'USDT',
    exitValue: '1800.00',
    exitCurrency: 'BRL',
    effectiveRate: '5.08',
    baseRate: '5.08',
    clientId: '03476666006',
    externalId: 'WIT-5678',
    wallet: '0x9a1f109551bD432803012645Ac136ddd64DBA2b4e',
    txHash: '0x9a1f109551bD432803012645Ac136ddd64DBA2b4e',
    state: 'Completed',
    expirationDate: '---',
    expired: false,
  },
  {
    id: 'tx_007',
    type: 'received' as const,
    amount: 'R$ 675,00',
    amountUSD: '132.80 USDT',
    description: 'Payment from merchant #5673',
    status: 'completed' as const,
    date: '2025-12-14T15:05:00',
    fee: 'R$ 6,75',
    createdAt: '2025-12-14T15:05:00',
    updatedAt: '2025-12-14T15:07:30',
    address: 'NOXH5L95375GKJ80KH1H6I75HLJE66I20L',
    checkoutUrl: 'https://checkout.crossramp.io/e2e/NOXH5L95375GKJ80KH1H6I75HLJE66I20L',
    template: 'fast_usdt_sol',
    process: 'onramp',
    entryValue: '675.00',
    entryCurrency: 'BRL',
    exitValue: '132.80',
    exitCurrency: 'USDT',
    effectiveRate: '5.08',
    baseRate: '5.08',
    clientId: '07820554336',
    externalId: '---',
    wallet: '9wFFyRfZBsuAHA4YcuxcXLKwMxJR43S7fF97mUn7fEVp',
    txHash: '9wFFyRfZBsuAHA4YcuxcXLKwMxJR43S7fF97mUn7fEVp',
    state: 'Completed',
    expirationDate: '2025-12-14T15:20:00',
    expired: false,
  },
  {
    id: 'tx_008',
    type: 'received' as const,
    amount: 'R$ 1.120,00',
    amountUSD: '220.30 USDT',
    description: 'Payment from merchant #2103',
    status: 'failed' as const,
    date: '2025-12-14T12:40:00',
    fee: 'R$ 0,00',
    createdAt: '2025-12-14T12:40:00',
    updatedAt: '2025-12-14T12:55:00',
    address: 'NOXI6M06486HLK91LI2I7J86IMKF77J31M',
    checkoutUrl: 'https://checkout.crossramp.io/e2e/NOXI6M06486HLK91LI2I7J86IMKF77J31M',
    template: 'fast_usdt_base',
    process: 'onramp',
    entryValue: '1120.00',
    entryCurrency: 'BRL',
    exitValue: '220.30',
    exitCurrency: 'USDT',
    effectiveRate: '5.08',
    baseRate: '5.08',
    clientId: '08931665447',
    externalId: '---',
    wallet: '---',
    txHash: '---',
    state: 'Failed',
    expirationDate: '2025-12-14T12:55:00',
    expired: true,
  },
];

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMins < 60) {
    return `${diffInMins}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else {
    return `${diffInDays}d ago`;
  }
}

export function TransactionsView() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'received' | 'sent'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const filteredTransactions = mockTransactions.filter((tx) => {
    if (selectedFilter === 'all') return true;
    return tx.type === selectedFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Manrope' }}>Payments</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all payment transactions
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-ring outline-none transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-foreground text-background'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            All transactions
          </button>
          <button
            onClick={() => setSelectedFilter('received')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              selectedFilter === 'received'
                ? 'bg-foreground text-background'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setSelectedFilter('sent')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              selectedFilter === 'sent'
                ? 'bg-foreground text-background'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            Sent
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div>
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="divide-y divide-border">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => setSelectedTransaction(tx)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'received'
                        ? 'bg-foreground/5'
                        : 'bg-muted'
                    }`}
                  >
                    {tx.type === 'received' ? (
                      <ArrowDownLeft className="size-5 text-foreground" />
                    ) : (
                      <ArrowUpRight className="size-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate" style={{ fontSize: '14px' }}>
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-muted-foreground text-xs">
                            {formatRelativeTime(tx.date)}
                          </span>
                          <span className="size-1 bg-muted-foreground/40 rounded-full" />
                          <span className="text-muted-foreground text-xs font-mono">
                            {tx.id}
                          </span>
                        </div>
                      </div>

                      {/* Amount and Status */}
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`font-medium ${
                            tx.type === 'received' ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                          style={{ fontFamily: 'Manrope', fontSize: '15px' }}
                        >
                          {tx.type === 'received' ? '+' : '-'}{tx.amount}
                        </p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {tx.amountUSD}
                        </p>
                        <div className="mt-1.5">
                          {tx.status === 'completed' && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-foreground/5 text-foreground border-0"
                            >
                              Completed
                            </Badge>
                          )}
                          {tx.status === 'pending' && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-secondary/10 text-secondary-foreground border-0"
                            >
                              Pending
                            </Badge>
                          )}
                          {tx.status === 'failed' && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-destructive/10 text-destructive border-0"
                            >
                              Failed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full">
              <ChevronDown className="size-4 mr-2" />
              Load more transactions
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <PaymentDetailsModal
          open={true}
          onOpenChange={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}