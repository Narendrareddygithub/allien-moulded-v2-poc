import React, { useState } from 'react';
import { Role, Project } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import AIChat from './components/AIChat';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [role, setRole] = useState<Role>('Manager');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectAI, setProjectAI] = useState<Project | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      <Sidebar showToast={showToast} activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab !== 'Projects') {
          setActiveProject(null);
        }
      }} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role={role} setRole={setRole} showToast={showToast} activeTab={activeProject ? 'Project Details' : (activeTab === 'Projects' ? 'Project Intelligence' : activeTab)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
           {activeProject ? (
             <ProjectDetail 
               project={activeProject} 
               onBack={() => setActiveProject(null)} 
               role={role} 
               showToast={showToast}
             />
           ) : (
             <Dashboard 
               role={role} 
               activeTab={activeTab}
               onSelectProject={setActiveProject} 
               onOpenProjectAI={setProjectAI}
               showToast={showToast}
             />
           )}
        </main>
      </div>

      {/* Main Gemini AI Chat */}
      <AnimatePresence>
        {isAIOpen && <AIChat onClose={() => setIsAIOpen(false)} mode="gemini" role={role} />}
      </AnimatePresence>

      {/* Project Specific Simulated AI Chat */}
      <AnimatePresence>
        {projectAI && <AIChat onClose={() => setProjectAI(null)} mode="gemini" projectContext={projectAI} role={role} />}
      </AnimatePresence>

      {!isAIOpen && !projectAI && (
        <button 
          onClick={() => {
            showToast("Connecting to Gemini AI...");
            setIsAIOpen(true);
          }}
          className="fixed bottom-6 right-6 bg-[#1E2538] text-white p-4 rounded-full shadow-lg hover:bg-slate-800 transition-colors z-50 flex items-center gap-2"
        >
          <Sparkles size={20} className="text-[#F5A64C]" />
          <span className="font-medium">Ask AI</span>
        </button>
      )}

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-[100]"
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-sm font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
