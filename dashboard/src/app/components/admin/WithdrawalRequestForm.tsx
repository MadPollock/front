import React from 'react';
import { ProtectedActionForm } from './ProtectedActionForm';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { postCommand, CommandContext } from '../../lib/commandClient';
import { useStrings } from '../../hooks/useStrings';

// Mock data for accounts
const accountsData = [
  {
    currency: 'USDT',
    accounts: [
      {
        id: 'usdt-trx',
        network: 'TRX',
        balance: '12,480.90',
      },
      {
        id: 'usdt-sol',
        network: 'SOL',
        balance: '8,320.45',
      },
      {
        id: 'usdt-eth',
        network: 'ETH',
        balance: '5,230.10',
      },
    ],
  },
  {
    currency: 'USDC',
    accounts: [
      {
        id: 'usdc-eth',
        network: 'ETH',
        balance: '15,680.00',
      },
      {
        id: 'usdc-sol',
        network: 'SOL',
        balance: '9,450.25',
      },
    ],
  },
  {
    currency: 'BRL',
    accounts: [
      {
        id: 'brl-pix',
        network: 'PIX',
        balance: '42,890.50',
      },
    ],
  },
];

// Mock data for whitelisted wallets
const whitelistedWallets = [
  {
    id: 'wallet-1',
    label: 'Treasury Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    network: 'ETH',
  },
  {
    id: 'wallet-2',
    label: 'Operations Wallet',
    address: 'TXYZPZUhEBGJHSN2H8MNKVdGmGQu3mF7sX',
    network: 'TRX',
  },
  {
    id: 'wallet-3',
    label: 'Cold Storage',
    address: '9wFFyRfZBsuAHA4YcuxcXLKwMxJR43S7fF97mUn7fEVp',
    network: 'SOL',
  },
  {
    id: 'wallet-4',
    label: 'Partner Settlement',
    address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    network: 'ETH',
  },
  {
    id: 'wallet-5',
    label: 'Backup Wallet',
    address: 'CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq',
    network: 'SOL',
  },
];

// Mock data for PIX addresses
const pixAddresses = [
  {
    id: 'pix-1',
    label: 'Company Account',
    address: 'company@bank.com',
    type: 'Email',
  },
  {
    id: 'pix-2',
    label: 'Treasury PIX',
    address: '+55 11 98765-4321',
    type: 'Phone',
  },
  {
    id: 'pix-3',
    label: 'Operations PIX',
    address: '12.345.678/0001-90',
    type: 'CNPJ',
  },
];

export function WithdrawalRequestForm() {
  const [selectedAccount, setSelectedAccount] = React.useState('');
  const [selectedWallet, setSelectedWallet] = React.useState('');
  const [withdrawalType, setWithdrawalType] = React.useState<'same' | 'brl'>('same');
  const { t } = useStrings();

  const handleWithdrawal = async (
    data: Record<string, FormDataEntryValue>,
    context: CommandContext
  ) => {
    const payload = {
      ...data,
      account: selectedAccount,
      wallet: selectedWallet,
      withdrawalType,
    };

    await postCommand('withdrawals/request', payload, context);
  };

  // Get the selected account details
  const selectedAccountDetails = accountsData
    .flatMap((currencyGroup) => 
      currencyGroup.accounts.map((account) => ({
        ...account,
        currency: currencyGroup.currency,
      }))
    )
    .find((account) => account.id === selectedAccount);

  // Filter wallets based on withdrawal type and selected account network
  const filteredWallets = selectedAccountDetails
    ? withdrawalType === 'same'
      ? whitelistedWallets.filter(
          (wallet) => wallet.network === selectedAccountDetails.network
        )
      : pixAddresses
    : [];

  // Reset wallet when withdrawal type or account changes
  React.useEffect(() => {
    setSelectedWallet('');
  }, [withdrawalType, selectedAccount]);

  const formatBalance = (balance: string, currency: string) => {
    if (currency === 'BRL') {
      return `R$ ${balance}`;
    }
    return `${balance} ${currency}`;
  };

  return (
    <ProtectedActionForm
      title={t('form.withdraw.title')}
      description={t('form.withdraw.description')}
      onSubmit={handleWithdrawal}
      requiresMFA={true}
      actionDescription="Withdraw funds to external address"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="account">{t('form.withdraw.account')}</Label>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger id="account">
              <SelectValue placeholder={t('form.withdraw.account')} />
            </SelectTrigger>
            <SelectContent>
              {accountsData.map((currencyGroup) => (
                <React.Fragment key={currencyGroup.currency}>
                  {currencyGroup.accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between gap-4 w-full">
                        <span className="text-sm">
                          {currencyGroup.currency} · {account.network}
                        </span>
                        <span
                          className="text-xs text-muted-foreground font-mono"
                          style={{ fontFamily: 'Manrope' }}
                        >
                          {formatBalance(account.balance, currencyGroup.currency)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t('form.withdraw.account.helper')}
          </p>
        </div>

        {/* Withdrawal Type - Only show for non-BRL accounts */}
        {selectedAccountDetails && selectedAccountDetails.currency !== 'BRL' && (
          <div className="space-y-2">
            <Label htmlFor="withdrawal-type">{t('form.withdraw.type')}</Label>
            <Select value={withdrawalType} onValueChange={(value: 'same' | 'brl') => setWithdrawalType(value)}>
              <SelectTrigger id="withdrawal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="same">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium">{t('form.withdraw.type.same')} ({selectedAccountDetails.currency})</span>
                    <span className="text-xs text-muted-foreground">
                      {t('form.withdraw.type.same.helper', { network: selectedAccountDetails.network })}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="brl">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium">{t('form.withdraw.type.brl')}</span>
                    <span className="text-xs text-muted-foreground">
                      {t('form.withdraw.type.brl.helper')}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {withdrawalType === 'brl' && (
              <p className="text-xs text-muted-foreground">
                {t('form.withdraw.type.brl.helper')}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="amount">{t('form.withdraw.amount')}</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            required
            disabled={!selectedAccount}
          />
          {selectedAccountDetails && (
            <p className="text-xs text-muted-foreground">
              Available: {formatBalance(selectedAccountDetails.balance, selectedAccountDetails.currency)}
            </p>
          )}
          {!selectedAccount && (
            <p className="text-xs text-muted-foreground">
              {t('form.withdraw.amount.helper')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="wallet">
            {withdrawalType === 'brl' ? t('form.withdraw.wallet.pix') : t('form.withdraw.wallet')}
          </Label>
          <Select 
            value={selectedWallet} 
            onValueChange={setSelectedWallet}
            disabled={!selectedAccount}
          >
            <SelectTrigger id="wallet">
              <SelectValue placeholder={withdrawalType === 'brl' ? t('form.withdraw.wallet.placeholder.pix') : t('form.withdraw.wallet.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {filteredWallets.length > 0 ? (
                filteredWallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm font-medium">{wallet.label}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {withdrawalType === 'brl' 
                          ? (wallet as any).address
                          : `${wallet.address.slice(0, 12)}...${wallet.address.slice(-8)}`
                        }
                      </span>
                      {withdrawalType === 'brl' && (wallet as any).type && (
                        <span className="text-xs text-muted-foreground">
                          {(wallet as any).type} key
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  {selectedAccount 
                    ? (withdrawalType === 'brl' ? t('form.withdraw.wallet.none.pix') : t('form.withdraw.wallet.none'))
                    : t('form.withdraw.amount.helper')}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {selectedWallet && (
            <p className="text-xs text-muted-foreground font-mono break-all">
              {withdrawalType === 'brl'
                ? pixAddresses.find((p) => p.id === selectedWallet)?.address
                : whitelistedWallets.find((w) => w.id === selectedWallet)?.address
              }
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">{t('form.withdraw.note')}</Label>
          <Input
            id="note"
            name="note"
            type="text"
            placeholder="Add a note..."
          />
        </div>
      </div>
    </ProtectedActionForm>
  );
}
