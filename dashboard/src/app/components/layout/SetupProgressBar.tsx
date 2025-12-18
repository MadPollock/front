import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useOnboardingProgress } from '../../store/userPreferences';
import { Button } from '../ui/button';
import { useStrings } from '../../hooks/useStrings';

export function SetupProgressBar() {
  const { t } = useStrings();
  const { step, steps } = useOnboardingProgress();
  const totalSteps = Object.keys(steps).length;

  // Don't render if setup is complete
  if (step >= totalSteps) {
    return null;
  }

  const stepLabels = {
    kyc: t('onboarding.step.kyc.title'),
    mfa: t('onboarding.step.mfa.title'),
    template: t('onboarding.step.template.title'),
    checkout: t('onboarding.step.checkout.title'),
  } as const;

  // Compute progress values
  const completedSteps = Object.values(steps).filter((status) => status === 'completed').length;
  const progress = (completedSteps / totalSteps) * 100;

  // Find the next incomplete step
  const nextStep = (Object.entries(steps).find(([_, status]) => status !== 'completed')?.[0] ??
    undefined) as keyof typeof stepLabels | undefined;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border-b border-primary/20">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Progress Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  {t('layout.brand.subtitle')} • Onboarding
                </span>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {t('onboarding.progress', { completed: completedSteps, total: totalSteps })}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2 w-full bg-background/50 dark:bg-background/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Next Step Hint - Shows below bar on mobile, inline on desktop */}
            {nextStep && (
              <div className="mt-1.5">
                <p className="text-xs text-muted-foreground">
                  Next: {stepLabels[nextStep]}
                </p>
              </div>
            )}
          </div>

          {/* Right: CTA Button */}
          {nextStep && (
            <Button
              size="sm"
              className="flex-shrink-0 gap-1.5 bg-primary hover:bg-primary/90"
              onClick={() => {
                const widget = document.getElementById('onboarding-widget');
                widget?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span className="hidden sm:inline">{t('onboarding.scrollCta')}</span>
              <span className="sm:hidden">{t('onboarding.scrollCta')}</span>
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
