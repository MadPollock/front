import React, { useCallback, useMemo, useState } from 'react';
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
import { useStrings } from '../../hooks/useStrings';

const stepOrder: OnboardingStepId[] = ['kyc', 'mfa', 'template', 'checkout'];

const stepMeta: Record<
  OnboardingStepId,
  { title: string; description: string; helper: string; badge?: string }
> = {
  kyc: {
    title: 'onboarding.step.kyc.title',
    description: 'onboarding.step.kyc.description',
    helper: 'onboarding.step.kyc.helper',
    badge: 'onboarding.step.kyc.badge',
  },
  mfa: {
    title: 'onboarding.step.mfa.title',
    description: 'onboarding.step.mfa.description',
    helper: 'onboarding.step.mfa.helper',
    badge: 'onboarding.step.mfa.badge',
  },
  template: {
    title: 'onboarding.step.template.title',
    description: 'onboarding.step.template.description',
    helper: 'onboarding.step.template.helper',
  },
  checkout: {
    title: 'onboarding.step.checkout.title',
    description: 'onboarding.step.checkout.description',
    helper: 'onboarding.step.checkout.helper',
  },
};

export function OnboardingWidget() {
  const { steps } = useOnboardingProgress();
  const { completeOnboardingStep } = useUserPreferences();
  const [syncingStep, setSyncingStep] = useState<OnboardingStepId | null>(null);
  const { t } = useStrings();

  const { totalSteps, completedCount, progress } = useMemo(() => {
    const total = stepOrder.length;
    const completed = stepOrder.filter((id) => steps[id] === 'completed').length;
    return {
      totalSteps: total,
      completedCount: completed,
      progress: (completed / total) * 100,
    };
  }, [steps]);

  const handleStepClick = useCallback(
    (stepId: OnboardingStepId) => {
      if (steps[stepId] === 'completed' || syncingStep === stepId) return;

      // Optimistic completion with a single state update
      completeOnboardingStep(stepId);
      setSyncingStep(stepId);

      // Simulated background sync callback
      window.setTimeout(() => {
        setSyncingStep((current) => (current === stepId ? null : current));
      }, 900);
    },
    [completeOnboardingStep, steps, syncingStep]
  );

  return (
    <Card id="onboarding-widget" className="border-primary/20 bg-primary/5 dark:bg-primary/10">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            {t('onboarding.title')}
          </CardTitle>
          <CardDescription>{t('onboarding.subtitle')}</CardDescription>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-muted-foreground">{t('onboarding.progress', { completed: completedCount, total: totalSteps })}</p>
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
                      <span className="font-medium">{t(meta.title)}</span>
                      {meta.badge && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          {t(meta.badge)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{t(meta.description)}</p>
                    <p className="text-xs text-muted-foreground">{t(meta.helper)}</p>
                  </div>
                  {status === 'completed' && !isSyncing && (
                    <span className="text-xs font-semibold text-primary">{t('onboarding.completed.label')}</span>
                  )}
                  {isSyncing && (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Loader2 className="size-4 animate-spin" /> {t('onboarding.syncing')}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          {t('onboarding.note')}
        </div>
      </CardContent>
    </Card>
  );
}
