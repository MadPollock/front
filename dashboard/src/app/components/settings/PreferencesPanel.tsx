/**
 * PreferencesPanel - User preferences configuration UI
 * 
 * This component demonstrates how to use the user preferences store.
 * It provides a UI for users to customize their experience.
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  Settings, 
  Palette, 
  Bell, 
  Eye, 
  RotateCcw,
  Moon,
  Sun,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { useUserPreferences, ChartTheme, useSetupComplete, useSetupSteps } from '../../store/userPreferences';
import { useTheme } from 'next-themes';

export function PreferencesPanel() {
  const { theme, setTheme } = useTheme();
  const setupComplete = useSetupComplete();
  const setupSteps = useSetupSteps();
  const {
    // State
    sidebarCollapsed,
    compactMode,
    chartTheme,
    animationsEnabled,
    notificationsEnabled,
    soundEnabled,
    highContrast,
    reducedMotion,
    dateFormat,
    numberFormat,
    
    // Actions
    setSidebarCollapsed,
    setCompactMode,
    setChartTheme,
    toggleAnimations,
    setNotificationsEnabled,
    setSoundEnabled,
    setHighContrast,
    setReducedMotion,
    setDateFormat,
    setNumberFormat,
    resetPreferences,
    completeSetupStep,
    dismissSetup,
  } = useUserPreferences();

  // Compute progress values
  const completedSteps = Object.values(setupSteps).filter(Boolean).length;
  const totalSteps = Object.keys(setupSteps).length;

  return (
    <div className="space-y-6 pb-6">
      <div className="pt-6 md:pt-0">
        <h1 style={{ fontFamily: 'Manrope' }}>
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your dashboard experience. All settings are saved automatically.
        </p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            Appearance
          </CardTitle>
          <CardDescription>
            Choose your preferred color scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-4" />
            Layout
          </CardTitle>
          <CardDescription>
            Adjust the dashboard layout to your preference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sidebar-collapsed">Collapse Sidebar</Label>
              <p className="text-sm text-muted-foreground">
                Minimize the navigation sidebar
              </p>
            </div>
            <Switch
              id="sidebar-collapsed"
              checked={sidebarCollapsed}
              onCheckedChange={setSidebarCollapsed}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Reduce spacing for more content density
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Visual Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="size-4" />
            Visual Theme
          </CardTitle>
          <CardDescription>
            Choose colors and animations for charts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Chart Color Theme</Label>
            <RadioGroup
              value={chartTheme}
              onValueChange={(value) => setChartTheme(value as ChartTheme)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="theme-default" />
                <Label htmlFor="theme-default" className="cursor-pointer">
                  Crossramp (Orange & Yellow)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vibrant" id="theme-vibrant" />
                <Label htmlFor="theme-vibrant" className="cursor-pointer">
                  Vibrant (Pink & Orange)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="muted" id="theme-muted" />
                <Label htmlFor="theme-muted" className="cursor-pointer">
                  Muted (Gray Tones)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monochrome" id="theme-monochrome" />
                <Label htmlFor="theme-monochrome" className="cursor-pointer">
                  Monochrome (Black & Gray)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Enable Animations</Label>
              <p className="text-sm text-gray-500">
                Smooth transitions and effects
              </p>
            </div>
            <Switch
              id="animations"
              checked={animationsEnabled}
              onCheckedChange={toggleAnimations}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-4" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-gray-500">
                Show alerts for important events
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound">Sound Alerts</Label>
              <p className="text-sm text-gray-500">
                Play sound for notifications
              </p>
            </div>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              disabled={!notificationsEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="size-4" />
            Accessibility
          </CardTitle>
          <CardDescription>
            Adjust settings for better visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <p className="text-sm text-gray-500">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduce Motion</Label>
              <p className="text-sm text-gray-500">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Data Display</CardTitle>
          <CardDescription>
            Control how data is formatted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Date Format</Label>
            <RadioGroup
              value={dateFormat}
              onValueChange={(value) => setDateFormat(value as 'relative' | 'absolute')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="relative" id="date-relative" />
                <Label htmlFor="date-relative" className="cursor-pointer">
                  Relative (2 hours ago)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="absolute" id="date-absolute" />
                <Label htmlFor="date-absolute" className="cursor-pointer">
                  Absolute (Dec 16, 2025 3:45 PM)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Number Format</Label>
            <RadioGroup
              value={numberFormat}
              onValueChange={(value) => setNumberFormat(value as 'compact' | 'full')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="number-compact" />
                <Label htmlFor="number-compact" className="cursor-pointer">
                  Compact (1.5M, 2.3K)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="number-full" />
                <Label htmlFor="number-full" className="cursor-pointer">
                  Full (1,500,000, 2,300)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Setup Progress (Demo Section) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            Getting Started Progress
          </CardTitle>
          <CardDescription>
            Track and manage your onboarding progress (for demo purposes)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(setupSteps).map(([key, completed]) => {
              const labels = {
                profileCompleted: 'Complete your profile',
                firstPaymentConfigured: 'Configure payment method',
                whitelistConfigured: 'Add whitelist addresses',
                teamMemberAdded: 'Invite team member',
              };
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {completed ? (
                      <CheckCircle2 className="size-4 text-primary" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {labels[key as keyof typeof labels]}
                    </span>
                  </div>
                  {!completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => completeSetupStep(key as keyof typeof setupSteps)}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Progress</Label>
              <p className="text-sm text-muted-foreground">
                {completedSteps} of {totalSteps} steps completed
              </p>
            </div>
            {setupComplete && (
              <span className="text-sm text-primary font-medium">✓ Complete</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={resetPreferences}
          className="gap-2"
        >
          <RotateCcw className="size-4" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}