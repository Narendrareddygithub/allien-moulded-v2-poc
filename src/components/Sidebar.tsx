import React from 'react';
import { LayoutDashboard, Search, FolderKanban, CheckSquare, Pin, Users, Settings } from 'lucide-react';

export default function Sidebar({ showToast, activeTab = 'Dashboard', setActiveTab }: { showToast: (msg: string) => void, activeTab?: string, setActiveTab?: (tab: string) => void }) {
  const handleNav = (label: string) => {
    if (setActiveTab) setActiveTab(label);
    showToast(`${label} selected`);
  };

  return (
    <aside className="w-64 bg-[#1E2538] text-slate-300 flex flex-col shrink-0 h-full">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('Dashboard')}>
          <svg viewBox="0 0 120 40" className="h-8 w-auto">
            <path d="M6,35 L22,6 L38,35 L30,35 L22,20 L14,35 Z" fill="#F5A64C" />
            <circle cx="22" cy="26" r="4.5" fill="#F5A64C" />
            <path d="M28,35 L40,14 L52,35 L46,35 L40,24 L34,35 Z" fill="#F5A64C" />
          </svg>
          <div className="flex flex-col leading-none text-white font-bold tracking-tight justify-center">
            <span className="text-[13px] mb-[2px]">Allied</span>
            <span className="text-[13px]">Moulded</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Workspace</h3>
          <div className="space-y-1">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => handleNav('Dashboard')} />
            <NavItem icon={<Search size={18} className="text-blue-400" />} label="AI Search" active={activeTab === 'AI Search'} onClick={() => handleNav('AI Search')} />
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Intelligence</h3>
          <div className="space-y-1">
            <NavItem icon={<FolderKanban size={18} className="text-amber-400" />} label="Projects" active={activeTab === 'Projects'} onClick={() => handleNav('Projects')} />
            <NavItem icon={<CheckSquare size={18} className="text-emerald-400" />} label="Decision Log" active={activeTab === 'Decision Log'} onClick={() => handleNav('Decision Log')} />
            <NavItem icon={<Pin size={18} className="text-rose-400" />} label="Commitments" badge="3" active={activeTab === 'Commitments'} onClick={() => handleNav('Commitments')} />
            <NavItem icon={<Users size={18} className="text-purple-400" />} label="Employee Knowledge" active={activeTab === 'Employee Knowledge'} onClick={() => handleNav('Employee Knowledge')} />
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">System</h3>
          <div className="space-y-1">
            <NavItem icon={<Settings size={18} className="text-slate-400" />} label="Admin Settings" active={activeTab === 'Admin Settings'} onClick={() => handleNav('Admin Settings')} />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors" onClick={() => showToast("Opening Profile")}>
          <div className="w-8 h-8 rounded bg-[#F5A64C] text-[#1E2538] flex items-center justify-center font-bold text-sm">
            MR
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Mike Reynolds</span>
            <span className="text-[10px] text-slate-400">Admin • Operations</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, badge, onClick }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-[#F5A64C] text-white font-medium shadow-sm' : 'hover:bg-white/5 hover:text-white text-slate-300'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {badge && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white text-[#F5A64C]' : 'bg-rose-500 text-white'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}
