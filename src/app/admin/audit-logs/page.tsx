import React from 'react';
import { FileText } from 'lucide-react';

export default function AuditLogsPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="text-gov-teal" /> Audit Logs
          </h1>
          <p className="text-gray-400">CERT-In & RTI Act 2005 compliant system logs.</p>
        </div>
      </div>
      <div className="bg-gov-card border border-gov-border rounded-xl p-8 shadow-lg text-center">
        <p className="text-gray-400">Log table functionality is under development.</p>
      </div>
    </div>
  );
}
