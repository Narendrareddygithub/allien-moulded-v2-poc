import React, { useState } from 'react';
import { Project, Role, Department } from '../types';
import { ArrowLeft, CheckCircle2, Send, Image as ImageIcon, Mic, Video, FileText, Settings, FileCheck, Package, Truck, User, History, Maximize2, Minimize2, PlayCircle, X } from 'lucide-react';
import Walkthrough from './Walkthrough';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  role: Role;
  showToast: (msg: string) => void;
}

const STAGES: Department[] = ['Sales', 'Design', 'Production', 'Quality', 'Dispatch'];

export default function ProjectDetail({ project, onBack, role, showToast }: ProjectDetailProps) {
  const [selectedStage, setSelectedStage] = useState<Department>(project.status);
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const currentStageIndex = STAGES.indexOf(project.status);

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <button 
          onClick={() => { showToast("Returning to Dashboard"); onBack(); }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white border border-transparent hover:border-slate-200 transition-all text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[#1E2538]">{project.name}</h1>
            <button 
              onClick={() => {
                showToast("Opening Revision History");
                setShowVersionHistory(true);
              }}
              className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-2 py-0.5 rounded uppercase transition-colors"
              title="View Revision History & Tracking"
            >
              <History size={12} />
              Rev {project.currentRevision}
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{project.salesOrder}</span>
            <span>•</span>
            <span>{project.client}</span>
            <span>•</span>
            <span>Dispatch Target: {project.dueDate}</span>
          </div>
        </div>
      </div>

      {/* Compact Progress Stepper */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-4 shrink-0 relative">
        {showWalkthrough && (
          <div className="absolute left-1/4 top-full mt-2 z-50">
            <Walkthrough 
              step={2} 
              text="Click on any stage to view its specific details (e.g., Design for CAD models, Production for Routing)." 
              onClose={() => setShowWalkthrough(false)} 
            />
          </div>
        )}
        <div className="flex justify-between items-center relative px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full -z-10" />
          <div 
            className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-[#1E2538] rounded-full -z-10 transition-all duration-500"
            style={{ width: `calc(${(currentStageIndex / (STAGES.length - 1)) * 100}% - 2rem)` }}
          />
          
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isSelected = stage === selectedStage;
            
            return (
              <button 
                key={stage} 
                onClick={() => {
                  showToast(`Viewing ${stage} details`);
                  setSelectedStage(stage);
                  if (isChatExpanded) setIsChatExpanded(false); // Auto-collapse chat if they click a stage
                }}
                className="flex flex-col items-center gap-1 bg-white px-2 group"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  isSelected ? 'ring-4 ring-indigo-50 border-[#1E2538] bg-[#1E2538] text-white scale-110' :
                  isCompleted ? 'bg-[#1E2538] border-[#1E2538] text-white' : 
                  isCurrent ? 'bg-white border-amber-500 text-amber-500' : 
                  'bg-white border-slate-200 text-slate-300 group-hover:border-slate-400'
                }`}>
                  {isCompleted && !isSelected ? <CheckCircle2 size={12} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isSelected ? 'text-[#1E2538]' :
                  isCurrent ? 'text-amber-500' : 
                  isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {stage}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area (Vertical Split Layout) */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
        
        {/* Top Side: Stage Specific Content */}
        {!isChatExpanded && (
          <div 
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-y-auto p-5 transition-all duration-300 relative"
            style={{ resize: 'vertical', minHeight: '200px', height: '50%' }}
          >
            <StageContent stage={selectedStage} project={project} showToast={showToast} />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 cursor-ns-resize hover:bg-amber-500/50 transition-colors" title="Drag to resize" />
          </div>
        )}

        {/* Bottom Side: Project Chat */}
        <div className={`flex-1 flex flex-col bg-slate-50 rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[200px] transition-all duration-300`}>
          <div className="bg-[#1E2538] text-white px-4 py-3 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-semibold text-sm">Project Chat</h3>
              <p className="text-[10px] text-slate-300">Replace WhatsApp dependency</p>
            </div>
            <button 
              onClick={() => {
                setIsChatExpanded(!isChatExpanded);
                showToast(isChatExpanded ? "Restored split view" : "Expanded chat view");
              }} 
              className="text-slate-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
              title={isChatExpanded ? "Minimize Chat" : "Expand Chat"}
            >
              {isChatExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <ChatMessage 
              sender="Sales Team" 
              time="10:30 AM" 
              text="Customer requested an ECR to increase quantity to 150. See attached reference image." 
              image="https://picsum.photos/seed/panel/300/200"
            />
            <ChatMessage 
              sender="Production Manager" 
              time="10:45 AM" 
              text="We have the capacity, but we need Purchase to confirm inventory. Listen to my voice note for details." 
              audio 
              isOwn={role === 'Manager'} 
            />
            <ChatMessage 
              sender="Purchase Dept" 
              time="11:00 AM" 
              text="Checking BOM now. We have enough stock. Proceeding with ECN." 
            />
          </div>

          <div className="p-3 bg-white border-t border-slate-200 shrink-0 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <select 
                className="text-xs bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-700 outline-none focus:border-[#1E2538]"
                onChange={(e) => showToast(`Recipient set to: ${e.target.value}`)}
              >
                <option value="all">All Stakeholders</option>
                <option value="sales">Sales Team</option>
                <option value="design">Design Team</option>
                <option value="production">Production Team</option>
                <option value="quality">Quality Team</option>
                <option value="dispatch">Dispatch Team</option>
                <option value="manager">Managers</option>
                <option value="ceo">CEO</option>
              </select>
              <div className="flex gap-1">
                <button onClick={() => showToast("Attach Image simulated")} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded transition-colors" title="Attach Image"><ImageIcon size={16} /></button>
                <button onClick={() => showToast("Record Audio simulated")} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded transition-colors" title="Record Audio"><Mic size={16} /></button>
                <button onClick={() => showToast("Attach Video simulated")} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded transition-colors" title="Attach Video"><Video size={16} /></button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 bg-slate-100 border-transparent rounded-full px-4 py-2 text-sm focus:bg-white focus:border-[#1E2538] focus:ring-2 focus:ring-[#1E2538]/20 outline-none transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    showToast("Message sent successfully");
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button 
                onClick={() => showToast("Message sent successfully")}
                className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-[#1E2538] flex items-center gap-2">
                <History size={20} /> Revision History & Tracking
              </h2>
              <button onClick={() => setShowVersionHistory(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-200 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                <HistoryEvent 
                  rev="R2" 
                  date="Oct 12, 2026" 
                  title="Engineering Change Notice (ECN) Approved" 
                  desc="Quantity increased from 100 to 150. BOM updated to reflect additional raw material requirements." 
                  author="Manager (Approved)" 
                  isLatest 
                />
                <HistoryEvent 
                  rev="R1" 
                  date="Oct 10, 2026" 
                  title="Design Freeze & Customer Approval" 
                  desc="Customer approved the As-Built Drawing. Tolerance updated to ±0.05 mm." 
                  author="Sales Team" 
                />
                <HistoryEvent 
                  rev="R0" 
                  date="Oct 05, 2026" 
                  title="Initial Quotation & PO Received" 
                  desc="Purchase Order (PO) received based on RFQ. Sales Order (SO) generated." 
                  author="System" 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Stage Specific Content Components ---

function StageContent({ stage, project, showToast }: { stage: Department, project: Project, showToast: (msg: string) => void }) {
  switch (stage) {
    case 'Sales':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-lg font-bold text-[#1E2538] flex items-center gap-2"><FileText size={20} /> Sales & Order Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoCard title="RFQ Reference" value="RFQ-9021" />
            <InfoCard title="Quotation" value="QT-2026-044 (Rev B)" />
            <InfoCard title="Purchase Order (PO)" value="PO-GLOBAL-882" />
            <InfoCard title="Payment Terms" value="Advance 50%, Net 30" />
            <InfoCard title="Target Revenue" value="$45,000" />
            <InfoCard title="Dispatch Commitment" value={project.dueDate} />
          </div>
          <button onClick={() => showToast("Downloading Quotation PDF")} className="mt-4 bg-slate-100 text-slate-700 px-4 py-2 rounded text-sm font-medium hover:bg-slate-200 transition-colors">
            View Quotation Document
          </button>
        </div>
      );
    case 'Design':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-lg font-bold text-[#1E2538] flex items-center gap-2"><Settings size={20} /> Design & Engineering</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase">3D CAD Model</p>
                <button onClick={() => showToast("Opening CAD Viewer")} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-100">View Full</button>
              </div>
              <img src="https://picsum.photos/seed/cadmodel/400/300" alt="CAD Model Placeholder" className="w-full h-40 object-cover rounded border border-slate-200" referrerPolicy="no-referrer" />
            </div>
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase">2D Sketch / GD&T</p>
                <button onClick={() => showToast("Opening 2D Drawing")} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-100">View Full</button>
              </div>
              <img src="https://picsum.photos/seed/blueprint/400/300?grayscale" alt="2D Sketch Placeholder" className="w-full h-40 object-cover rounded border border-slate-200" referrerPolicy="no-referrer" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Package size={16} className="text-slate-400" /> Bill of Materials (BOM)</h3>
            <div className="space-y-2 border border-slate-200 rounded-lg p-1">
              <BOMItem part="PN-10045" name="MS Sheet 2mm" qty="4 sq.m" />
              <BOMItem part="PN-20991" name="SS304 Fasteners M6" qty="24 pcs" />
              <BOMItem part="PN-30112" name="ABS Plastic Handle" qty="2 pcs" />
            </div>
          </div>
        </div>
      );
    case 'Production':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-lg font-bold text-[#1E2538] flex items-center gap-2"><Settings size={20} /> Production Routing</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <InfoCard title="Work Order (WO)" value="WO-8891" />
            <InfoCard title="Batch / Lot" value="LOT-26-A" />
            <InfoCard title="OEE" value="85%" />
          </div>
          <div className="space-y-3 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
             <RoutingItem step="1" name="Laser Cutting" status="completed" />
             <RoutingItem step="2" name="Bending" status="completed" />
             <RoutingItem step="3" name="Welding & Assembly" status="active" />
             <RoutingItem step="4" name="Powder Coating" status="pending" />
          </div>
        </div>
      );
    case 'Quality':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-lg font-bold text-[#1E2538] flex items-center gap-2"><FileCheck size={20} /> Quality Assurance</h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoCard title="Tolerance Spec" value="±0.05 mm" />
            <InfoCard title="Material Spec" value="SS304 Grade" />
          </div>
          <div className="space-y-3 mt-4">
            <QualityCheck name="Incoming Inspection (IQC)" status="Passed" date="Oct 10, 2026" />
            <QualityCheck name="In-Process Inspection (IPQC)" status="Passed" date="Oct 12, 2026" />
            <QualityCheck name="First Article Inspection (FAI)" status="Pending" date="-" />
            <QualityCheck name="Final Inspection (FQC)" status="Pending" date="-" />
          </div>
          <button onClick={() => showToast("Opening NCR Form")} className="mt-2 text-sm text-red-600 font-medium hover:underline">
            + Raise Non-Conformance Report (NCR)
          </button>
        </div>
      );
    case 'Dispatch':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-lg font-bold text-[#1E2538] flex items-center gap-2"><Truck size={20} /> Dispatch & Logistics</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
            <Truck size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-slate-700 font-medium mb-1">Awaiting Dispatch Readiness</h3>
            <p className="text-xs text-slate-500 mb-4">Production and Quality checks must be completed before generating Delivery Challan (DC).</p>
            <button onClick={() => showToast("Cannot generate DC yet. Prerequisites not met.")} className="bg-slate-200 text-slate-500 px-4 py-2 rounded text-sm font-medium cursor-not-allowed">
              Generate Delivery Challan (DC)
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InfoCard title="Transporter" value="Pending Assignment" />
            <InfoCard title="E-Way Bill" value="Not Generated" />
          </div>
        </div>
      );
    default:
      return <div>Select a stage</div>;
  }
}

// --- Helper Components ---

function InfoCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function BOMItem({ part, name, qty }: { part: string, name: string, qty: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 border-b border-slate-100 last:border-0 bg-white">
      <div>
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-[10px] font-mono text-slate-500">{part}</p>
      </div>
      <span className="text-xs font-semibold text-[#002A4E] bg-slate-100 px-2 py-1 rounded">{qty}</span>
    </div>
  );
}

function RoutingItem({ step, name, status }: { step: string, name: string, status: 'completed' | 'active' | 'pending' }) {
  return (
    <div className="relative flex items-center gap-4 group pl-1">
      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white z-10 shrink-0 shadow-sm ${
        status === 'completed' ? 'border-emerald-500 text-emerald-500' :
        status === 'active' ? 'border-[#F5A64C] text-[#F5A64C]' :
        'border-slate-300 text-slate-300'
      }`}>
        {status === 'completed' ? <CheckCircle2 size={12} /> : <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-[#F5A64C]' : 'bg-slate-300'}`} />}
      </div>
      <div className="flex-1 p-3 rounded-lg border border-slate-100 bg-white shadow-sm flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-slate-900">{name}</p>
          <span className="text-[10px] font-bold text-slate-400">OP-{step}0</span>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
          status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
          status === 'active' ? 'bg-orange-50 text-orange-700' :
          'bg-slate-50 text-slate-500'
        }`}>{status}</span>
      </div>
    </div>
  );
}

function QualityCheck({ name, status, date }: { name: string, status: string, date: string }) {
  const isPassed = status === 'Passed';
  return (
    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div>
        <p className="text-sm font-medium text-slate-700">{name}</p>
        <p className="text-[10px] text-slate-400">{date}</p>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
        {status}
      </span>
    </div>
  );
}

function ChatMessage({ sender, time, text, isOwn, image, audio }: { sender: string, time: string, text: string, isOwn?: boolean, image?: string, audio?: boolean }) {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[10px] font-semibold text-slate-500">{sender}</span>
        <span className="text-[9px] text-slate-400">{time}</span>
      </div>
      <div className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed shadow-sm ${isOwn ? 'bg-[#002A4E] text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
        {text}
        {image && (
          <img src={image} alt="Attachment" className="mt-2 rounded border border-black/10 max-w-full h-auto" referrerPolicy="no-referrer" />
        )}
        {audio && (
          <div className={`mt-2 flex items-center gap-2 p-2 rounded-lg ${isOwn ? 'bg-white/10' : 'bg-slate-100'}`}>
            <PlayCircle size={24} className={isOwn ? 'text-white cursor-pointer hover:text-slate-200' : 'text-[#002A4E] cursor-pointer hover:text-[#001f3b]'} />
            <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden min-w-[100px]">
              <div className="w-1/3 h-full bg-current rounded-full"></div>
            </div>
            <span className="text-[10px] font-mono">0:14</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryEvent({ rev, date, title, desc, author, isLatest }: { rev: string, date: string, title: string, desc: string, author: string, isLatest?: boolean }) {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${isLatest ? 'bg-[#002A4E] text-white' : 'bg-slate-200 text-slate-600'}`}>
        <span className="text-xs font-bold">{rev}</span>
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        <p className="text-sm text-slate-600 mb-3">{desc}</p>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <User size={14} />
          {author}
        </div>
      </div>
    </div>
  );
}
