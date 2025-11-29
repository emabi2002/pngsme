'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { PNG_PROVINCES, BUSINESS_SECTORS, PNG_BANKS } from '@/lib/constants';
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

type BusinessType = 'formal' | 'informal';

interface FormData {
  // Step 1: Business Basics
  businessName: string;
  businessType: BusinessType;
  sectors: string[];
  description: string;

  // Step 2: Location
  province: string;
  district: string;
  cityVillage: string;
  address: string;
  phone: string;
  email: string;

  // Step 3: Legal Info (Optional for informal)
  tin: string;
  registrationNo: string;

  // Step 4: Banking (Optional)
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function SellerRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: 'informal',
    sectors: [],
    description: '',
    province: '',
    district: '',
    cityVillage: '',
    address: '',
    phone: '',
    email: '',
    tin: '',
    registrationNo: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSector = (sector: string) => {
    setFormData((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const supabase = createClient();

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('You must be logged in to register a business');
      }

      // Create business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
          owner_user_id: user.id,
          name: formData.businessName,
          slug: generateSlug(formData.businessName),
          type: formData.businessType,
          sector: formData.sectors,
          description: formData.description,
          province: formData.province,
          district: formData.district,
          city_village: formData.cityVillage,
          address: formData.address,
          phone: formData.phone,
          email: formData.email || user.email,
          tin: formData.tin || null,
          registration_no: formData.registrationNo || null,
          bank_name: formData.bankName || null,
          bank_account_no: formData.accountNumber || null,
          bank_account_name: formData.accountName || null,
          status: 'pending', // Requires admin approval
        })
        .select()
        .single();

      if (businessError) throw businessError;

      // Update user role to seller
      await supabase
        .from('users')
        .update({ role: 'seller' })
        .eq('id', user.id);

      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/seller/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register business');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Registration Submitted!</h3>
                <p className="text-muted-foreground">
                  Your business is pending approval. We'll notify you once it's verified.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Business Information'}
              {step === 2 && 'Location & Contact'}
              {step === 3 && 'Legal Information'}
              {step === 4 && 'Banking Details'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Tell us about your business'}
              {step === 2 && 'Where is your business located?'}
              {step === 3 && 'Legal registration details (optional for informal businesses)'}
              {step === 4 && 'Payment information for receiving funds'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Step 1: Business Basics */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Name *</label>
                  <Input
                    placeholder="e.g., Highland Fresh Produce"
                    value={formData.businessName}
                    onChange={(e) => updateFormData('businessName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Type *</label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => updateFormData('businessType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="informal">Informal (No registration required)</SelectItem>
                      <SelectItem value="formal">Formal (IPA registered)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Sectors * (Select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {BUSINESS_SECTORS.map((sector) => (
                      <Badge
                        key={sector.value}
                        variant={formData.sectors.includes(sector.value) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSector(sector.value)}
                      >
                        {sector.icon} {sector.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Description</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Describe your business, products, or services..."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Province *</label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => updateFormData('province', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PNG_PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">District</label>
                    <Input
                      placeholder="e.g., Goroka"
                      value={formData.district}
                      onChange={(e) => updateFormData('district', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">City/Village</label>
                    <Input
                      placeholder="e.g., Town"
                      value={formData.cityVillage}
                      onChange={(e) => updateFormData('cityVillage', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Physical Address *</label>
                  <Input
                    placeholder="e.g., Section 4, Main Market Street"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Phone *</label>
                  <Input
                    type="tel"
                    placeholder="+675 XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Email (Optional)</label>
                  <Input
                    type="email"
                    placeholder="business@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Legal Info */}
            {step === 3 && (
              <div className="space-y-4">
                {formData.businessType === 'informal' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <p className="text-sm text-blue-800">
                      As an informal business, these fields are optional. You can skip to the next step.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    TIN (Tax Identification Number) {formData.businessType === 'formal' && '*'}
                  </label>
                  <Input
                    placeholder="Enter TIN"
                    value={formData.tin}
                    onChange={(e) => updateFormData('tin', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    IPA Registration Number {formData.businessType === 'formal' && '*'}
                  </label>
                  <Input
                    placeholder="Enter registration number"
                    value={formData.registrationNo}
                    onChange={(e) => updateFormData('registrationNo', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Banking */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <p className="text-sm text-amber-800">
                    Banking details are optional but recommended for receiving payments.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <Select
                    value={formData.bankName}
                    onValueChange={(value) => updateFormData('bankName', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {PNG_BANKS.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={(e) => updateFormData('accountNumber', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Name</label>
                  <Input
                    placeholder="Account holder name"
                    value={formData.accountName}
                    onChange={(e) => updateFormData('accountName', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1 || loading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.businessName || formData.sectors.length === 0)) ||
                    (step === 2 && (!formData.province || !formData.address || !formData.phone))
                  }
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
