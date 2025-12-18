import React from 'react';
import { ProtectedActionForm } from './ProtectedActionForm';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { postCommand, CommandContext } from '../../lib/commandClient';
import { useStrings } from '../../hooks/useStrings';

// Currency and network options
const currencyNetworkOptions = [
  { currency: 'USDT', networks: ['TRX', 'SOL', 'ETH'] },
  { currency: 'USDC', networks: ['ETH', 'SOL'] },
  { currency: 'BRL', networks: ['PIX'] },
];

export function WhitelistForm() {
  const [selectedCurrency, setSelectedCurrency] = React.useState('');
  const [selectedNetwork, setSelectedNetwork] = React.useState('');
  const { t } = useStrings();

  const handleWhitelist = async (
    data: Record<string, FormDataEntryValue>,
    context: CommandContext
  ) => {
    const payload = {
      ...data,
      currency: selectedCurrency,
      network: selectedNetwork,
    };

    await postCommand('whitelist/add', payload, context);
  };

  // Get available networks for the selected currency
  const availableNetworks = selectedCurrency
    ? currencyNetworkOptions.find((option) => option.currency === selectedCurrency)?.networks || []
    : [];

  // Reset network when currency changes
  React.useEffect(() => {
    setSelectedNetwork('');
  }, [selectedCurrency]);

  return (
    <ProtectedActionForm
      title={t('form.whitelist.title')}
      description={t('form.whitelist.description')}
      onSubmit={handleWhitelist}
      requiresMFA={true}
      actionDescription="Add address to whitelist"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency">{t('form.whitelist.currency')}</Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger id="currency">
                <SelectValue placeholder={t('form.whitelist.currency')} />
              </SelectTrigger>
              <SelectContent>
                {currencyNetworkOptions.map((option) => (
                  <SelectItem key={option.currency} value={option.currency}>
                    {option.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="network">{t('form.whitelist.network')}</Label>
            <Select 
              value={selectedNetwork} 
              onValueChange={setSelectedNetwork}
              disabled={!selectedCurrency}
            >
              <SelectTrigger id="network">
                <SelectValue placeholder={t('form.whitelist.network')} />
              </SelectTrigger>
              <SelectContent>
                {availableNetworks.length > 0 ? (
                  availableNetworks.map((network) => (
                    <SelectItem key={network} value={network}>
                      {network}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Select currency first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whitelist-label">{t('form.whitelist.label')}</Label>
          <Input
            id="whitelist-label"
            name="label"
            type="text"
            placeholder="e.g., Treasury Wallet"
            required
          />
          <p className="text-xs text-muted-foreground">
            {t('form.whitelist.label.helper')}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whitelist-address">{t('form.whitelist.address')}</Label>
          <Input
            id="whitelist-address"
            name="address"
            type="text"
            placeholder={selectedNetwork ? `Enter ${selectedNetwork} address` : "Select currency and network first"}
            required
            className="font-mono text-sm"
            disabled={!selectedNetwork}
          />
          {selectedNetwork && (
            <p className="text-xs text-muted-foreground">
              {selectedNetwork === 'PIX' 
                ? t('form.whitelist.address.pix') 
                : `${selectedNetwork} ${t('form.whitelist.address.helper')}`}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whitelist-reason">{t('form.whitelist.reason')}</Label>
          <Textarea
            id="whitelist-reason"
            name="reason"
            placeholder="Enter reason for whitelisting..."
            required
            rows={3}
          />
        </div>
      </div>
    </ProtectedActionForm>
  );
}
