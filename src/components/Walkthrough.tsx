import React from 'react';
import { X } from 'lucide-react';

interface WalkthroughProps {
  step: number;
  text: string;
  onClose: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Walkthrough({ step, text, onClose, position = 'bottom' }: WalkthroughProps) {
  return (
    <div className="absolute z-50 w-64 bg-[#002A4E] text-white p-4 rounded-lg shadow-xl border border-[#F5A64C]/30 mt-2">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[#F5A64C] font-bold text-sm uppercase tracking-wider">Step {step}</span>
        <button onClick={onClose} className="text-slate-300 hover:text-white"><X size={16} /></button>
      </div>
      <p className="text-sm">{text}</p>
      <div className="mt-3 flex justify-end">
        <button onClick={onClose} className="text-xs bg-[#F5A64C] text-[#002A4E] px-3 py-1 rounded font-semibold hover:bg-orange-400 transition-colors">Got it</button>
      </div>
    </div>
  );
}
