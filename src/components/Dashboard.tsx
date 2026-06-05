import React, { useState } from 'react';
import { Role, Project } from '../types';
import { mockProjects } from '../data/mockData';
import { Sparkles, AlertTriangle, Check, Clock, ChevronRight, Settings, Package, FileText, Flame, Key, Folder, CheckSquare, Pin, User } from 'lucide-react';

interface DashboardProps {
  role: Role;
  activeTab: string;
  onSelectProject: (project: Project) => void;
  onOpenProjectAI: (project: Project) => void;
  showToast: (msg: string) => void;
}

export default function Dashboard({ role, activeTab, onSelectProject, onOpenProjectAI, showToast }: DashboardProps) {
  if (activeTab === 'Projects') {
    return <ProjectIntelligenceView onSelectProject={onSelectProject} onOpenProjectAI={onOpenProjectAI} showToast={showToast} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {role === 'Designer' ? (
          <>
            <StatCard title="MY DESIGN TASKS" value="5" subtext="2 due this week" subtextColor="text-amber-500" borderColor="border-l-amber-500" icon={<Folder size={24} className="fill-current" />} />
            <StatCard title="CAD MODELS REVIEWS" value="12" subtext="3 pending approval" subtextColor="text-blue-500" borderColor="border-l-blue-500" icon={<Settings size={24} className="fill-current" />} />
            <StatCard title="ECN REQUESTS" value="4" subtext="1 urgent" subtextColor="text-rose-500" borderColor="border-l-rose-500" icon={<Flame size={24} className="fill-current" />} />
            <StatCard title="BOM UPDATES" value="28" subtext="All synced" subtextColor="text-emerald-500" borderColor="border-l-emerald-500" icon={<Package size={24} className="fill-current" />} />
          </>
        ) : (
          <>
            <StatCard title="ACTIVE PROJECTS" value="12" subtext="↑ 2 this month" subtextColor="text-emerald-500" borderColor="border-l-amber-500" icon={<Folder size={24} className="fill-current" />} />
            <StatCard title="DECISIONS LOGGED" value="84" subtext="↑ 11 this week" subtextColor="text-emerald-500" borderColor="border-l-emerald-500" icon={<CheckSquare size={24} className="fill-current" />} />
            <StatCard title="OPEN COMMITMENTS" value="37" subtext="3 overdue" subtextColor="text-rose-500" borderColor="border-l-blue-500" icon={<Pin size={24} className="fill-current" />} />
            <StatCard title="TEAM MEMBERS" value="24" subtext="Across 5 departments" subtextColor="text-slate-400" borderColor="border-l-purple-500" icon={<User size={24} className="fill-current" />} />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">{role === 'Designer' ? 'My Design Queue' : 'Active Projects'}</h2>
            <button className="text-sm text-amber-600 font-medium hover:underline">View all →</button>
          </div>
          <div className="space-y-6">
            {role === 'Designer' ? (
              <>
                <ProjectListItem title="CAD: New Mould Line – Plant 2" dept="Design" tasks={3} owner="You" progress={72} color="bg-amber-500" />
                <ProjectListItem title="BOM: Q3 Supplier Qualification" dept="Engineering" tasks={2} owner="You" progress={45} color="bg-blue-500" />
                <ProjectListItem title="Sketch: ISO 9001 Renewal Audit" dept="Design" tasks={5} owner="You" progress={88} color="bg-emerald-500" />
                <ProjectListItem title="Routing: ERP Data Migration" dept="Production" tasks={1} owner="You" progress={30} color="bg-purple-500" />
              </>
            ) : (
              <>
                <ProjectListItem title="New Mould Line – Plant 2" dept="Engineering" tasks={8} owner="Mike Reynolds" progress={72} color="bg-amber-500" />
                <ProjectListItem title="Q3 Supplier Qualification" dept="Procurement" tasks={5} owner="Sarah Chen" progress={45} color="bg-blue-500" />
                <ProjectListItem title="ISO 9001 Renewal Audit" dept="Quality" tasks={12} owner="James Dyer" progress={88} color="bg-emerald-500" />
                <ProjectListItem title="ERP Data Migration (Phase 1)" dept="IT" tasks={6} owner="Tom Walsh" progress={30} color="bg-purple-500" />
              </>
            )}
          </div>
        </div>

        {/* Recent Decisions List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">{role === 'Designer' ? 'Design Approvals' : 'Recent Decisions'}</h2>
            <button className="text-sm text-amber-600 font-medium hover:underline">View log →</button>
          </div>
          <div className="space-y-6">
            {role === 'Designer' ? (
              <>
                <DecisionItem title="Approved: CAD Model Rev 2.1" author="Mike Reynolds" dept="Engineering" date="Feb 22" status="approved" />
                <DecisionItem title="Approved: Material Spec SS304" author="Sarah Chen" dept="Procurement" date="Feb 21" status="approved" />
                <DecisionItem title="Pending: Tolerance Adjustment ±0.02" author="James Dyer" dept="Quality" date="Feb 20" status="pending" />
                <DecisionItem title="Approved: Drawing Freeze Plant 2" author="Linda Park" dept="Finance" date="Feb 19" status="approved" />
              </>
            ) : (
              <>
                <DecisionItem title="Approved: Resin supplier switch (Borealis)" author="Sarah Chen" dept="Procurement" date="Feb 22" status="approved" />
                <DecisionItem title="Approved: Overtime for Mould Line install" author="Mike Reynolds" dept="Engineering" date="Feb 21" status="approved" />
                <DecisionItem title="Pending: New QC inspection protocol" author="James Dyer" dept="Quality" date="Feb 20" status="pending" />
                <DecisionItem title="Approved: Budget revision +$42k Plant 2" author="Linda Park" dept="Finance" date="Feb 19" status="approved" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start justify-between">
        <div className="flex gap-3">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-amber-900 mb-1">3 Overdue Commitments Need Attention</h3>
            <p className="text-sm text-amber-800">
              Tom Walsh · ERP migration checklist · was due Feb 18 | Sarah Chen · Vendor evaluation · was due Feb 20 | James Dyer · Audit docs · was due Feb 21
            </p>
          </div>
        </div>
        <button className="text-sm font-medium text-amber-700 hover:text-amber-900 whitespace-nowrap">Review →</button>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtext, subtextColor, borderColor, icon }: { title: string, value: string, subtext: string, subtextColor: string, borderColor: string, icon: React.ReactNode }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 ${borderColor} relative`}>
      <div className="absolute top-6 right-6 text-slate-200">
        {icon}
      </div>
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="text-4xl font-serif font-bold text-[#1E2538] mb-2">{value}</div>
      <div className={`text-sm font-medium ${subtextColor}`}>{subtext}</div>
    </div>
  );
}

function ProjectListItem({ title, dept, tasks, owner, progress, color }: { title: string, dept: string, tasks: number, owner: string, progress: number, color: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${color}`} />
        <div>
          <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{dept} · {tasks} tasks · {owner}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 w-32">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-medium text-slate-500 w-8 text-right">{progress}%</span>
      </div>
    </div>
  );
}

function DecisionItem({ title, author, dept, date, status }: { title: string, author: string, dept: string, date: string, status: 'approved' | 'pending' }) {
  return (
    <div className="flex items-start gap-3 group cursor-pointer">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
        {status === 'approved' ? <Check size={16} /> : <Clock size={16} />}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{author} · {dept} · {date}</p>
      </div>
    </div>
  );
}

// --- Project Intelligence View ---

function ProjectIntelligenceView({ onSelectProject, onOpenProjectAI, showToast }: { onSelectProject: (p: Project) => void, onOpenProjectAI: (p: Project) => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-end gap-2 mb-6">
        <FilterPill label="All" active />
        <FilterPill label="Engineering" />
        <FilterPill label="Quality" />
        <FilterPill label="Procurement" />
        <FilterPill label="IT" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* We map mockProjects to the new card design, or just hardcode the ones from the screenshot to match perfectly */}
        <ProjectCard 
          icon={<Settings size={20} className="text-purple-500" />}
          iconBg="bg-purple-50"
          title="New Mould Line – Plant 2"
          dept="Engineering"
          startDate="Jan 15, 2025"
          progress={72}
          tasks={8}
          decisions={4}
          overdue={2}
          status="Active"
          statusColor="text-emerald-600"
          dueText="Due Mar 30"
          dueColor="text-amber-600"
          onClick={() => onSelectProject(mockProjects[0])}
          onOpenAI={() => onOpenProjectAI(mockProjects[0])}
        />
        <ProjectCard 
          icon={<Package size={20} className="text-amber-700" />}
          iconBg="bg-amber-50"
          title="Q3 Supplier Qualification"
          dept="Procurement"
          startDate="Feb 1, 2025"
          progress={45}
          tasks={5}
          decisions={2}
          overdue={1}
          status="Active"
          statusColor="text-emerald-600"
          dueText="Due Apr 15"
          dueColor="text-amber-600"
          onClick={() => onSelectProject(mockProjects[1])}
          onOpenAI={() => onOpenProjectAI(mockProjects[1])}
        />
        <ProjectCard 
          icon={<FileText size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          title="ISO 9001 Renewal Audit"
          dept="Quality"
          startDate="Dec 10, 2024"
          progress={88}
          tasks={12}
          decisions={7}
          overdue={0}
          status="In Review"
          statusColor="text-amber-600"
          dueText="Mar 10 Audit"
          dueColor="text-emerald-600"
          onClick={() => onSelectProject(mockProjects[2])}
          onOpenAI={() => onOpenProjectAI(mockProjects[2])}
        />
        <ProjectCard 
          icon={<Settings size={20} className="text-blue-500" />}
          iconBg="bg-blue-50"
          title="ERP Data Migration – Phase 1"
          dept="IT"
          startDate="Feb 5, 2025"
          progress={30}
          tasks={6}
          decisions={1}
          overdue={1}
          status="Planning"
          statusColor="text-purple-600"
          dueText="1 Overdue"
          dueColor="text-rose-500"
          onClick={() => onSelectProject(mockProjects[0])}
          onOpenAI={() => onOpenProjectAI(mockProjects[0])}
        />
        <ProjectCard 
          icon={<Flame size={20} className="text-rose-500" />}
          iconBg="bg-rose-50"
          title="Safety Protocol Update"
          dept="Operations"
          startDate="Jan 28, 2025"
          progress={60}
          tasks={9}
          decisions={3}
          overdue={0}
          status="Active"
          statusColor="text-emerald-600"
          dueText="Due Apr 1"
          dueColor="text-blue-500"
          onClick={() => onSelectProject(mockProjects[1])}
          onOpenAI={() => onOpenProjectAI(mockProjects[1])}
        />
        <ProjectCard 
          icon={<Key size={20} className="text-pink-500" />}
          iconBg="bg-pink-50"
          title="Resin Procurement Optimization"
          dept="Procurement"
          startDate="Feb 12, 2025"
          progress={15}
          tasks={4}
          decisions={2}
          overdue={0}
          status="Planning"
          statusColor="text-purple-600"
          dueText="Early Stage"
          dueColor="text-purple-600"
          onClick={() => onSelectProject(mockProjects[2])}
          onOpenAI={() => onOpenProjectAI(mockProjects[2])}
        />
      </div>
    </div>
  );
}

function FilterPill({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${active ? 'bg-white border-amber-500 text-amber-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
      {label}
    </button>
  );
}

function ProjectCard({ icon, iconBg, title, dept, startDate, progress, tasks, decisions, overdue, status, statusColor, dueText, dueColor, onClick, onOpenAI }: any) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all flex flex-col h-full relative group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenAI();
            }}
            className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded hover:bg-amber-100 transition-colors"
          >
            <Sparkles size={10} /> Ask AI
          </button>
          <span className={`text-xs font-bold ${statusColor}`}>{status}</span>
        </div>
      </div>
      
      <div className="mb-6 flex-1">
        <h3 className="text-base font-bold text-slate-800 mb-1 leading-tight">{title}</h3>
        <p className="text-xs text-slate-500">{dept} · Started {startDate}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-slate-500 font-medium">{progress}% complete</div>
      </div>

      <div className="flex justify-between items-end">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-800 leading-none mb-1">{tasks}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Tasks</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-800 leading-none mb-1">{decisions}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Decisions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-800 leading-none mb-1">{overdue}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Overdue</span>
          </div>
        </div>
        <div className={`text-xs font-bold px-2.5 py-1 rounded-md bg-slate-50 ${dueColor}`}>
          {dueText}
        </div>
      </div>
    </div>
  );
}
