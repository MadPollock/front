import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Shield, Sparkles } from 'lucide-react';
import {
  OnboardingStepId,
  OnboardingStepStatus,
  useOnboardingProgress,
  useUserPreferences,
} from '../../store/userPreferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

const stepOrder: OnboardingStepId[] = ['kyc', 'mfa', 'template', 'checkout'];

const stepMeta: Record<
  OnboardingStepId,
  { title: string; description: string; helper: string; badge?: string }
> = {
  kyc: {
    title: 'Complete KYC with Facial Recognition',
    description: 'Verify your identity securely with a quick liveness check.',
    helper: 'Takes ~2 minutes. Required before moving funds.',
    badge: 'Compliance',
  },
  mfa: {
    title: 'Setup MFA',
    description: 'Add an authenticator app or hardware key for write actions.',
    helper: 'Required to authorize withdrawals and whitelist changes.',
    badge: 'Security',
  },
  template: {
    title: 'Create a Template',
    description: 'Define a reusable payout or invoice template.',
    helper: 'Keeps write commands consistent for your team.',
  },
  checkout: {
    title: 'Create a checkout/payment',
    description: 'Spin up a sample checkout to validate the flow end-to-end.',
    helper: 'Simulates API-side callback processing.',
  },
};

export function OnboardingWidget() {
  const { steps } = useOnboardingProgress();
  const { completeOnboardingStep, setOnboardingStepStatus } = useUserPreferences();
  const [syncingStep, setSyncingStep] = useState<OnboardingStepId | null>(null);

  const totalSteps = stepOrder.length;
  const completedCount = stepOrder.filter((id) => steps[id] === 'completed').length;
  const progress = (completedCount / totalSteps) * 100;

  const handleStepClick = (stepId: OnboardingStepId) => {
    if (steps[stepId] === 'completed') return;

    // Optimistic completion
    setOnboardingStepStatus(stepId, 'completed');
    completeOnboardingStep(stepId);
    setSyncingStep(stepId);

    // Simulated background sync callback
    setTimeout(() => {
      setSyncingStep((current) => (current === stepId ? null : current));
    }, 900);
  };

  return (
    <Card id="onboarding-widget" className="border-primary/20 bg-primary/5 dark:bg-primary/10">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Finish onboarding
          </CardTitle>
          <CardDescription>Complete these four steps to unlock write actions.</CardDescription>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-muted-foreground">{completedCount} of {totalSteps} done</p>
          <Progress value={progress} className="w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stepOrder.map((id) => {
            const status = steps[id] as OnboardingStepStatus;
            const meta = stepMeta[id];
            const isCompleted = status === 'completed';
            const isSyncing = syncingStep === id;

            return (
              <button
                key={id}
                onClick={() => handleStepClick(id)}
                className={`group w-full rounded-xl border p-4 text-left transition hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10 ${
                  isCompleted ? 'border-primary/40 bg-white dark:bg-slate-950' : 'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="size-4" /> : <ArrowRight className="size-4" />}
                      </div>
                      <span className="font-medium">{meta.title}</span>
                      {meta.badge && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          {meta.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{meta.description}</p>
                    <p className="text-xs text-muted-foreground">{meta.helper}</p>
                  </div>
                  {status === 'completed' && !isSyncing && (
                    <span className="text-xs font-semibold text-primary">Completed</span>
                  )}
                  {isSyncing && (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Loader2 className="size-4 animate-spin" /> Syncing…
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          Writes remain API-driven; callbacks will validate each completed step asynchronously via Auth0/KYC services.
        </div>
      </CardContent>
    </Card>
  );
}
