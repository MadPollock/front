import React from 'react';
import { WithdrawalRequestForm } from '../components/admin/WithdrawalRequestForm';
import { AlertCircle } from 'lucide-react';

export function WithdrawView() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div>
        <h1 style={{ fontFamily: 'Manrope' }}>Withdraw Funds</h1>
        <p className="text-muted-foreground mt-1">
          Submit a withdrawal request to move funds to an external wallet
        </p>
      </div>

      <div className="bg-accent border border-border rounded-xl p-4 flex gap-3">
        <AlertCircle className="size-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-foreground">
          <p className="font-semibold mb-1">Security Notice</p>
          <p className="text-muted-foreground">All withdrawal requests require two-factor authentication. Ensure you have access to your authenticator app before proceeding.</p>
        </div>
      </div>

      <WithdrawalRequestForm />
    </div>
  );
}