import React from 'react';
import CommunityReport from '@/components/public/CommunityReport';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Symptom Report | Nalam AI',
  description: 'Report symptoms anonymously to help detect disease clusters early.',
};

export default function CommunityReportPage() {
  return <CommunityReport />;
}
