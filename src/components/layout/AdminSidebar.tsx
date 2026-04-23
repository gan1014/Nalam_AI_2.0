'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, Bell, TrendingUp, FileText, CheckCircle, Package, LogOut } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Command Center', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Risk Map', href: '/admin/risk-map', icon: <Map size={20} /> },
    { name: 'Alerts & Dispatch', href: '/admin/alerts', icon: <Bell size={20} /> },
    { name: 'Disease Forecasts', href: '/admin/forecasts', icon: <TrendingUp size={20} /> },
    { name: 'Resource Mobilisation', href: '/admin/resources', icon: <Package size={20} /> },
    { name: 'PS08 Evaluation', href: '/evaluation', icon: <CheckCircle size={20} /> },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 bg-gov-dark border-r border-gov-border min-h-screen flex flex-col text-white font-sans">
      <div className="p-6 border-b border-gov-border">
        <h2 className="text-xl font-bold font-tamil text-gov-gold">நலம் AI</h2>
        <p className="text-xs text-gov-offwhite/60 tracking-wider uppercase mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {links.map(link => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                active 
                ? 'bg-gov-teal/20 text-gov-teal border-r-4 border-gov-teal' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 border-r-4 border-transparent'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gov-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gov-blue flex items-center justify-center font-bold text-lg">TN</div>
          <div>
            <p className="text-sm font-bold">Health Sec.</p>
            <p className="text-xs text-gray-400">IDSP Command</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full p-2 rounded hover:bg-white/5">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
