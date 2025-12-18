import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Shield, Loader2 } from 'lucide-react';

interface MFAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  actionDescription: string;
}

export function MFAModal({ isOpen, onClose, onVerify, actionDescription }: MFAModalProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      await onVerify(code);
      onClose();
      setCode('');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Shield className="size-6 text-amber-600" />
            </div>
            <div>
              <DialogTitle>Two-Factor Authentication</DialogTitle>
              <DialogDescription className="mt-1">
                This action requires additional verification
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Action:</strong> {actionDescription}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm">
              Enter the 6-digit code from your authenticator app
            </label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => {
                  setCode(value);
                  setError('');
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isVerifying}>
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying || code.length !== 6}>
            {isVerifying ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
