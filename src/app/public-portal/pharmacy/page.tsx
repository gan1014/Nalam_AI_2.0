import React from 'react';
import PharmacyTracker from '@/components/public/PharmacyTracker';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medicine Availability Tracker | Nalam AI',
  description: 'Track essential medicine stock and find pharmacies in Tamil Nadu.',
};

export default function PharmacyTrackerPage() {
  return <PharmacyTracker />;
}
