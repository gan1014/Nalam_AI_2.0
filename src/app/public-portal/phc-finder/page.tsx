import React from 'react';
import NearestPHCFinder from '@/components/public/NearestPHCFinder';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Nearest PHC | Nalam AI',
  description: 'Locate your nearest Government Primary Health Centre in Tamil Nadu.',
};

export default function PHCFinderPage() {
  return <NearestPHCFinder />;
}
