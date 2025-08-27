import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Save, 
  Settings, 
  Bell, 
  Globe, 
  Shield, 
  Briefcase 
} from 'lucide-react';

interface ProfileSettingsProps {
  userType: 'farmer' | 'buyer' | 'exporter' | 'inspector' | 'regulatory';
  userId: string;
}

export default function ProfileSettings({ userType, userId }: ProfileSettingsProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: [`/api/${userType}/settings`, userId],
    enabled: !!userId
  });

  // Form setup
  const form = useForm({
    defaultValues: {
      notifications: {
        email: true,
        sms: true,
      },
      preferences: {
        language: 'en',
        timezone: 'Africa/Monrovia',
      },
      privacy: {},
    }
  });

  // Update form when settings data loads
  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('PUT', `/api/${userType}/settings`, data);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/${userType}/settings`, userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateSettingsMutation.mutate(data);
  };

  const handleBack = () => {
    navigate(`/profile?type=${userType}&id=${userId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader className="border-b bg-slate-50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Manage your {userType} account preferences
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Notifications Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              
              <div className="space-y-4 pl-7">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-slate-600">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    {...form.register('notifications.email')}
                    data-testid="switch-email-notifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications" className="font-medium">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-slate-600">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    {...form.register('notifications.sms')}
                    data-testid="switch-sms-notifications"
                  />
                </div>

                {userType === 'farmer' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="harvest-reminders" className="font-medium">
                          Harvest Reminders
                        </Label>
                        <p className="text-sm text-slate-600">
                          Get reminders about upcoming harvests
                        </p>
                      </div>
                      <Switch
                        id="harvest-reminders"
                        {...form.register('notifications.harvest_reminders')}
                        data-testid="switch-harvest-reminders"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weather-alerts" className="font-medium">
                          Weather Alerts
                        </Label>
                        <p className="text-sm text-slate-600">
                          Receive weather warnings and updates
                        </p>
                      </div>
                      <Switch
                        id="weather-alerts"
                        {...form.register('notifications.weather_alerts')}
                        data-testid="switch-weather-alerts"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="market-updates" className="font-medium">
                          Market Updates
                        </Label>
                        <p className="text-sm text-slate-600">
                          Get updates on commodity prices
                        </p>
                      </div>
                      <Switch
                        id="market-updates"
                        {...form.register('notifications.market_updates')}
                        data-testid="switch-market-updates"
                      />
                    </div>
                  </>
                )}

                {userType === 'buyer' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="purchase-confirmations" className="font-medium">
                          Purchase Confirmations
                        </Label>
                        <p className="text-sm text-slate-600">
                          Confirm orders and payments
                        </p>
                      </div>
                      <Switch
                        id="purchase-confirmations"
                        {...form.register('notifications.purchase_confirmations')}
                        data-testid="switch-purchase-confirmations"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="harvest-notifications" className="font-medium">
                          Harvest Notifications
                        </Label>
                        <p className="text-sm text-slate-600">
                          Get notified when crops are ready
                        </p>
                      </div>
                      <Switch
                        id="harvest-notifications"
                        {...form.register('notifications.harvest_notifications')}
                        data-testid="switch-harvest-notifications"
                      />
                    </div>
                  </>
                )}

                {userType === 'exporter' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="shipment-updates" className="font-medium">
                          Shipment Updates
                        </Label>
                        <p className="text-sm text-slate-600">
                          Track shipment status changes
                        </p>
                      </div>
                      <Switch
                        id="shipment-updates"
                        {...form.register('notifications.shipment_updates')}
                        data-testid="switch-shipment-updates"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compliance-alerts" className="font-medium">
                          Compliance Alerts
                        </Label>
                        <p className="text-sm text-slate-600">
                          Important regulatory updates
                        </p>
                      </div>
                      <Switch
                        id="compliance-alerts"
                        {...form.register('notifications.compliance_alerts')}
                        data-testid="switch-compliance-alerts"
                      />
                    </div>
                  </>
                )}

                {userType === 'inspector' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="inspection-assignments" className="font-medium">
                          Inspection Assignments
                        </Label>
                        <p className="text-sm text-slate-600">
                          New inspection tasks assigned to you
                        </p>
                      </div>
                      <Switch
                        id="inspection-assignments"
                        {...form.register('notifications.inspection_assignments')}
                        data-testid="switch-inspection-assignments"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="urgent-alerts" className="font-medium">
                          Urgent Alerts
                        </Label>
                        <p className="text-sm text-slate-600">
                          Critical system alerts
                        </p>
                      </div>
                      <Switch
                        id="urgent-alerts"
                        {...form.register('notifications.urgent_alerts')}
                        data-testid="switch-urgent-alerts"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Preferences Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold">Preferences</h3>
              </div>
              
              <div className="space-y-4 pl-7">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select {...form.register('preferences.language')} defaultValue="en">
                      <SelectTrigger data-testid="select-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select {...form.register('preferences.timezone')} defaultValue="Africa/Monrovia">
                      <SelectTrigger data-testid="select-timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Monrovia">Monrovia (GMT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">New York (EST/EDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {userType === 'farmer' && (
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select {...form.register('preferences.currency')} defaultValue="LRD">
                      <SelectTrigger data-testid="select-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LRD">Liberian Dollar (LRD)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(userType === 'buyer' || userType === 'exporter') && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select {...form.register('preferences.currency')} defaultValue="USD">
                        <SelectTrigger data-testid="select-currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="LRD">Liberian Dollar (LRD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {userType === 'buyer' && (
                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Preferred Payment Method</Label>
                        <Select {...form.register('preferences.payment_method')} defaultValue="bank_transfer">
                          <SelectTrigger data-testid="select-payment-method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="mobile_money">Mobile Money</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Privacy Section */}
            {userType === 'farmer' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold">Privacy</h3>
                </div>
                
                <div className="space-y-4 pl-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="share-location" className="font-medium">
                        Share Location
                      </Label>
                      <p className="text-sm text-slate-600">
                        Allow sharing your farm location for traceability
                      </p>
                    </div>
                    <Switch
                      id="share-location"
                      {...form.register('privacy.share_location')}
                      data-testid="switch-share-location"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-profile" className="font-medium">
                        Public Profile
                      </Label>
                      <p className="text-sm text-slate-600">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      id="public-profile"
                      {...form.register('privacy.public_profile')}
                      data-testid="switch-public-profile"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow-contact" className="font-medium">
                        Allow Contact
                      </Label>
                      <p className="text-sm text-slate-600">
                        Allow buyers to contact you directly
                      </p>
                    </div>
                    <Switch
                      id="allow-contact"
                      {...form.register('privacy.allow_contact')}
                      data-testid="switch-allow-contact"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business-specific settings */}
            {(userType === 'buyer' || userType === 'exporter') && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold">
                    {userType === 'buyer' ? 'Business Settings' : 'Export Settings'}
                  </h3>
                </div>
                
                <div className="space-y-4 pl-7">
                  {userType === 'buyer' && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-approve-orders" className="font-medium">
                            Auto-approve Orders
                          </Label>
                          <p className="text-sm text-slate-600">
                            Automatically approve small orders
                          </p>
                        </div>
                        <Switch
                          id="auto-approve-orders"
                          {...form.register('business.auto_approve_orders')}
                          data-testid="switch-auto-approve-orders"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="require-quality-inspection" className="font-medium">
                            Require Quality Inspection
                          </Label>
                          <p className="text-sm text-slate-600">
                            Require inspection before payment
                          </p>
                        </div>
                        <Switch
                          id="require-quality-inspection"
                          {...form.register('business.require_quality_inspection')}
                          data-testid="switch-require-quality-inspection"
                        />
                      </div>
                    </>
                  )}

                  {userType === 'exporter' && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-generate-docs" className="font-medium">
                            Auto-generate Documentation
                          </Label>
                          <p className="text-sm text-slate-600">
                            Automatically create export documents
                          </p>
                        </div>
                        <Switch
                          id="auto-generate-docs"
                          {...form.register('export.auto_generate_docs')}
                          data-testid="switch-auto-generate-docs"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="require-pre-shipment-inspection" className="font-medium">
                            Require Pre-shipment Inspection
                          </Label>
                          <p className="text-sm text-slate-600">
                            Mandatory inspection before shipping
                          </p>
                        </div>
                        <Switch
                          id="require-pre-shipment-inspection"
                          {...form.register('export.require_pre_shipment_inspection')}
                          data-testid="switch-require-pre-shipment-inspection"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Form actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateSettingsMutation.isPending}
                className="flex-1"
                data-testid="button-save-settings"
              >
                {updateSettingsMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Settings
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}