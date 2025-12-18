import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ExternalLink, Copy, Check, X } from 'lucide-react';

interface PaymentDetailsModalProps {
  transaction: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDateTime(dateString: string): string {
  if (dateString === '---') return '---';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailRow({ label, value, copyable = false, link = false }: { label: string; value: string; copyable?: boolean; link?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-2">
        {link && value !== '---' ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium break-all hover:underline inline-flex items-center gap-1"
            style={{ fontFamily: 'Geist' }}
          >
            {value}
            <ExternalLink className="size-3 flex-shrink-0" />
          </a>
        ) : (
          <p className="text-sm font-medium break-all" style={{ fontFamily: 'Geist' }}>
            {value}
          </p>
        )}
        {copyable && value !== '---' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            {copied ? (
              <Check className="size-3 text-green-600" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export function PaymentDetailsModal({
  transaction,
  open,
  onOpenChange,
}: PaymentDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Manrope' }}>
            Payment Details
          </DialogTitle>
          <DialogDescription style={{ fontFamily: 'Manrope' }}>
            View detailed information about the payment transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              label="Criado em"
              value={formatDateTime(transaction.createdAt)}
            />
            <DetailRow
              label="Atualizado em"
              value={formatDateTime(transaction.updatedAt)}
            />
          </div>

          <div className="h-px bg-border" />

          {/* Address and URL */}
          <div className="space-y-4">
            <DetailRow
              label="Endereço"
              value={transaction.address}
              copyable
            />
            {transaction.checkoutUrl !== '---' && (
              <DetailRow
                label="URL"
                value={transaction.checkoutUrl}
                copyable
                link
              />
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Template and Process */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow label="Template" value={transaction.template} />
            <DetailRow label="Processo" value={transaction.process} />
          </div>

          <div className="h-px bg-border" />

          {/* Entry Details */}
          <div className="space-y-3">
            <p
              className="text-sm font-medium text-muted-foreground"
              style={{ fontFamily: 'Manrope' }}
            >
              Entrada
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="Valor de entrada" value={transaction.entryValue} />
              <DetailRow label="Moeda de entrada" value={transaction.entryCurrency} />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Exit Details */}
          <div className="space-y-3">
            <p
              className="text-sm font-medium text-muted-foreground"
              style={{ fontFamily: 'Manrope' }}
            >
              Saída
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="Valor de saída" value={transaction.exitValue} />
              <DetailRow label="Moeda de saída" value={transaction.exitCurrency} />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow label="Cotação efetiva" value={transaction.effectiveRate} />
            <DetailRow label="Cotação base" value={transaction.baseRate} />
          </div>

          <div className="h-px bg-border" />

          {/* Client and External ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow label="Cliente" value={transaction.clientId} />
            <DetailRow label="ID Externo" value={transaction.externalId} />
          </div>

          <div className="h-px bg-border" />

          {/* Blockchain Details */}
          <div className="space-y-4">
            {transaction.wallet !== '---' && (
              <DetailRow label="Wallet" value={transaction.wallet} copyable />
            )}
            {transaction.txHash !== '---' && (
              <DetailRow label="TX_HASH" value={transaction.txHash} copyable />
            )}
          </div>

          <div className="h-px bg-border" />

          {/* State and Expiration */}
          <div className="space-y-4">
            <DetailRow label="Estado" value={transaction.state} />
            {transaction.expirationDate !== '---' && (
              <DetailRow
                label="Data de expiração"
                value={formatDateTime(transaction.expirationDate)}
              />
            )}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Expirado
              </p>
              <div className="flex items-center gap-2">
                {transaction.expired ? (
                  <>
                    <X className="size-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Sim</span>
                  </>
                ) : (
                  <>
                    <Check className="size-4 text-green-600" />
                    <span className="text-sm font-medium">Não</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}