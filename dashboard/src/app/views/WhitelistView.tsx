import React from 'react';
import { WhitelistForm } from '../components/admin/WhitelistForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';

const mockWhitelistedAddresses = [
  { 
    id: 'wallet-1',
    label: 'Treasury Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 
    currency: 'USDT',
    network: 'ETH',
    status: 'active', 
    addedDate: '2024-01-15' 
  },
  { 
    id: 'wallet-2',
    label: 'Operations Wallet',
    address: 'TXYZPZUhEBGJHSN2H8MNKVdGmGQu3mF7sX', 
    currency: 'USDT',
    network: 'TRX',
    status: 'active', 
    addedDate: '2024-01-10' 
  },
  { 
    id: 'wallet-3',
    label: 'Cold Storage',
    address: '9wFFyRfZBsuAHA4YcuxcXLKwMxJR43S7fF97mUn7fEVp', 
    currency: 'USDT',
    network: 'SOL',
    status: 'pending', 
    addedDate: '2024-01-18' 
  },
  { 
    id: 'wallet-4',
    label: 'Partner Settlement',
    address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', 
    currency: 'USDC',
    network: 'ETH',
    status: 'active', 
    addedDate: '2024-01-12' 
  },
];

export function WhitelistView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 style={{ fontFamily: 'Manrope' }}>Whitelist Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage whitelisted addresses for secure operations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhitelistForm />

        <div className="bg-card rounded-2xl border border-border p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'Manrope', fontSize: '18px', fontWeight: 500 }} className="mb-4">Current Whitelist</h2>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWhitelistedAddresses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.address.slice(0, 10)}...{item.address.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm">{item.currency}</TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="outline">{item.network}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.addedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}