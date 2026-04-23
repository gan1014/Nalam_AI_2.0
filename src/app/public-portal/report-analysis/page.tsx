import React from 'react';
import GovHeader from '@/components/layout/GovHeader';
import GovFooter from '@/components/layout/GovFooter';
import MedicalReportAnalyzer from '@/components/public/MedicalReportAnalyzer';

export const metadata = {
  title: 'Medical Report Analysis | Nalam AI',
  description: 'AI-powered medical report interpretation for Tamil Nadu citizens. Upload blood tests, CBC, and dengue reports for instant analysis.',
};

export default function ReportAnalysisPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gov-offwhite">
      <GovHeader />
      
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <MedicalReportAnalyzer />
        </div>
      </div>

      <GovFooter />
    </main>
  );
}
