import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a101a] text-white font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Admin Header Strip */}
        <header className="bg-gov-dark border-b border-gov-border px-8 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-gov-green animate-pulse"></span>
            <span className="text-sm font-semibold text-gov-green">Live Surveillance Active</span>
          </div>
          <div className="text-sm text-gray-400">
            Last synced: {new Date().toLocaleTimeString()}
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
