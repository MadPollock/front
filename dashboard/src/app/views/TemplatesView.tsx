import React, { useState } from 'react';
import { Plus, MoreVertical, FileText, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/ui/collapsible';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { MFAModal } from '../components/admin/MFAModal';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  currency: string;
  feeBehavior: string;
  split: string;
  createdAt: Date;
}

export function TemplatesView() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Standard Checkout',
      currency: 'BRL',
      feeBehavior: 'Customer pays',
      split: 'None',
      createdAt: new Date('2025-01-10'),
    },
    {
      id: '2',
      name: 'Premium Split',
      currency: 'USD',
      feeBehavior: 'Merchant absorbs',
      split: '20% to partner',
      createdAt: new Date('2025-01-15'),
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [showMFA, setShowMFA] = useState(false);

  // Form state
  const [templateName, setTemplateName] = useState('');
  const [currency, setCurrency] = useState('');
  const [chargeCustomerFee, setChargeCustomerFee] = useState(false);
  const [chargeNetworkFee, setChargeNetworkFee] = useState(false);
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [splitPercentage, setSplitPercentage] = useState('');
  const [splitAddress, setSplitAddress] = useState('');
  const [buttonColor, setButtonColor] = useState('#ff4c00');
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [pin, setPin] = useState('');

  const handleCreateTemplate = () => {
    // Validate form
    if (!templateName || !currency) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Show MFA modal
    setShowMFA(true);
  };

  const handleMFAVerify = async (mfaCode: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newTemplate: Template = {
      id: Math.random().toString(36).substring(7),
      name: templateName,
      currency,
      feeBehavior: chargeCustomerFee ? 'Customer pays' : 'Merchant absorbs',
      split: splitEnabled ? `${splitPercentage}% to partner` : 'None',
      createdAt: new Date(),
    };

    setTemplates([...templates, newTemplate]);
    setShowMFA(false);
    setIsCreateOpen(false);
    resetForm();
    toast.success('Template created successfully');
  };

  const resetForm = () => {
    setTemplateName('');
    setCurrency('');
    setChargeCustomerFee(false);
    setChargeNetworkFee(false);
    setSplitEnabled(false);
    setSplitPercentage('');
    setSplitAddress('');
    setButtonColor('#ff4c00');
    setShowPoweredBy(true);
    setPin('');
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    toast.success('Template deleted');
  };

  // Empty state check
  const isEmpty = templates.length === 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <h1 style={{ fontFamily: 'Manrope' }}>Templates</h1>
        <p className="text-muted-foreground mt-1.5 max-w-3xl">
          Templates define how your checkout looks and behaves — currency, fees, and branding.
        </p>
      </div>

      {/* How Templates Work - Collapsible Section */}
      <div>
        <Collapsible open={explanationOpen} onOpenChange={setExplanationOpen}>
          <Card className="bg-muted/30 border-muted">
            <CollapsibleTrigger asChild>
              <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                <span className="text-sm text-muted-foreground">How templates work</span>
                {explanationOpen ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 pt-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Templates allow you to pre-configure checkout settings like currency, fee structure,
                  and branding. Once created, reference a template in your API calls to maintain
                  consistent checkout experiences without changing your integration.
                </p>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Templates List or Empty State */}
      {isEmpty ? (
        <div>
          <Card className="border-dashed">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <FileText className="size-7 text-muted-foreground/50" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'Manrope' }} className="text-foreground mb-2">
                Your templates will appear here
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                Create a template to define fees, currency, and branding for your checkout.
              </p>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Lock className="size-3.5" />
                Create template
              </Button>
              <button
                onClick={() => setExplanationOpen(true)}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Learn how templates work
              </button>
            </div>
          </Card>
        </div>
      ) : (
        <>
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {templates.length} {templates.length === 1 ? 'template' : 'templates'}
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Lock className="size-3.5" />
              <Plus className="size-4" />
              <span className="hidden sm:inline">Create template</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>

          {/* Templates List */}
          <div className="space-y-3">
            {templates.map((template) => (
              <Card key={template.id} className="hover:bg-muted/30 transition-colors">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h3 style={{ fontFamily: 'Manrope' }} className="text-foreground mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Created {template.createdAt.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Currency</p>
                          <p className="text-sm text-foreground">{template.currency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Fee Behavior</p>
                          <p className="text-sm text-foreground">{template.feeBehavior}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Split</p>
                          <p className="text-sm text-foreground">{template.split}</p>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Create Template Sheet */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-6">
            <SheetTitle style={{ fontFamily: 'Manrope' }}>Create Template</SheetTitle>
            <SheetDescription>
              Configure checkout settings that can be reused across payments.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8 px-4">
            {/* Section 1 - Basics */}
            <div className="space-y-4">
              <div>
                <h3 style={{ fontFamily: 'Manrope', fontSize: '14px' }} className="text-foreground mb-3">
                  Basics
                </h3>
                <Separator />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-name">Template name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., Standard Checkout"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Counterparty currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section 2 - Fees */}
            <div className="space-y-4">
              <div>
                <h3 style={{ fontFamily: 'Manrope', fontSize: '14px' }} className="text-foreground mb-3">
                  Fees
                </h3>
                <Separator />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="customer-fee">Charge fee to end customer</Label>
                  <p className="text-xs text-muted-foreground">
                    Customer pays processing fees
                  </p>
                </div>
                <Switch
                  id="customer-fee"
                  checked={chargeCustomerFee}
                  onCheckedChange={setChargeCustomerFee}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="network-fee">Charge network fee</Label>
                  <p className="text-xs text-muted-foreground">
                    Include blockchain gas fees
                  </p>
                </div>
                <Switch
                  id="network-fee"
                  checked={chargeNetworkFee}
                  onCheckedChange={setChargeNetworkFee}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="split">Enable payment split</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically split payments
                  </p>
                </div>
                <Switch
                  id="split"
                  checked={splitEnabled}
                  onCheckedChange={setSplitEnabled}
                />
              </div>

              {splitEnabled && (
                <div className="space-y-3 pl-4 border-l-2 border-muted ml-2">
                  <div className="space-y-2">
                    <Label htmlFor="split-percentage">Split percentage</Label>
                    <Input
                      id="split-percentage"
                      type="number"
                      placeholder="20"
                      value={splitPercentage}
                      onChange={(e) => setSplitPercentage(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="split-address">Split destination address</Label>
                    <Input
                      id="split-address"
                      placeholder="0x..."
                      value={splitAddress}
                      onChange={(e) => setSplitAddress(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3 - Branding */}
            <div className="space-y-4">
              <div>
                <h3 style={{ fontFamily: 'Manrope', fontSize: '14px' }} className="text-foreground mb-3">
                  Branding
                </h3>
                <Separator />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button-color">Button color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="button-color"
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo (optional)</Label>
                <Input id="logo" type="file" accept="image/*" />
                <p className="text-xs text-muted-foreground">
                  Recommended: 400x400px, PNG or SVG
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="powered-by">Show "Powered by Nox"</Label>
                  <p className="text-xs text-muted-foreground">
                    Display branding in checkout
                  </p>
                </div>
                <Switch
                  id="powered-by"
                  checked={showPoweredBy}
                  onCheckedChange={setShowPoweredBy}
                />
              </div>
            </div>

            {/* Section 4 - Security */}
            <div className="space-y-4">
              <div>
                <h3 style={{ fontFamily: 'Manrope', fontSize: '14px' }} className="text-foreground mb-3">
                  Security
                </h3>
                <Separator />
              </div>

              <div className="rounded-lg bg-muted/50 p-3 border border-muted">
                <div className="flex gap-2">
                  <Lock className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    For security reasons, creating or editing templates requires PIN and 2FA.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-4 pb-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                onClick={handleCreateTemplate}
                disabled={!templateName || !currency || !pin}
              >
                <Lock className="size-3.5" />
                Create template
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* MFA Modal */}
      <MFAModal
        isOpen={showMFA}
        onClose={() => setShowMFA(false)}
        onVerify={handleMFAVerify}
        actionDescription="create template"
      />
    </div>
  );
}