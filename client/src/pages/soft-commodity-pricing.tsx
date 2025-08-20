import React from 'react';
import { SoftCommodityPricing } from '@/components/SoftCommodityPricing';

export default function SoftCommodityPricingPage() {
  // Check if user can edit (DDGOTS role)
  const canEdit = true; // This would be determined by user role in real implementation

  return (
    <div className="container mx-auto px-4 py-8">
      <SoftCommodityPricing canEdit={canEdit} />
    </div>
  );
}