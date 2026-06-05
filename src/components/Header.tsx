import React, { useState } from 'react';
import { Bell, Search, User, HelpCircle } from 'lucide-react';
import { Role } from '../types';

interface HeaderProps {
  role: Role;
  setRole: (role: Role) => void;
  showToast: (msg: string) => void;
  activeTab?: string;
}

export default function Header({ role, setRole, showToast, activeTab = 'Dashboard' }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    { id: 1, text: "New ECN approved for Plant 2", time: "5m ago", unread: true, target: "Projects" },
    { id: 2, text: "Supplier Qualification due tomorrow", time: "2h ago", unread: true, target: "Projects" },
    { id: 3, text: "ISO 9001 Audit scheduled", time: "1d ago", unread: false, target: "Dashboard" },
  ];

  const handleNotificationClick = (target: string) => {
    showToast(`Redirecting to ${target}`);
    // In a real app, we would use a router or state to change the view
    // For this POC, we'll just show a toast and close the menu
    setShowNotifications(false);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 relative z-20">
      <div className="flex items-center gap-8 flex-1">
        <h1 className="text-2xl font-serif font-bold text-[#1E2538] min-w-[200px]">{activeTab}</h1>
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          <input 
            type="text" 
            placeholder="Quick search across all knowledge..." 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
            onKeyDown={(e) => e.key === 'Enter' && showToast("Search feature simulated")}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-8">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#1E2538] hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                <button className="text-xs text-amber-600 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => handleNotificationClick(n.target)}
                    className={`p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${n.unread ? 'bg-amber-50/30' : ''}`}
                  >
                    <p className={`text-sm ${n.unread ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center border-t border-slate-100">
                <button className="text-xs font-medium text-slate-500 hover:text-slate-800">View All</button>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => showToast("Opening Help Center")}
          className="w-10 h-10 flex items-center justify-center text-rose-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
        >
          <HelpCircle size={18} />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 ml-2">
          <select 
            value={role}
            onChange={(e) => {
              setRole(e.target.value as Role);
              showToast(`Role switched to ${e.target.value}`);
            }}
            className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none cursor-pointer"
          >
            <option value="Designer">Designer View</option>
            <option value="Manager">Manager View</option>
            <option value="CEO">CEO View</option>
          </select>
        </div>
      </div>
    </header>
  );
}
