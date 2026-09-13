import React from 'react';
import { Download, X, CheckSquare } from 'lucide-react';

interface BatchActionBarProps {
  selectedCount: number;
  onOpenBatchModal: () => void;
  onClearSelection: () => void;
  lang: 'en' | 'bn';
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  onOpenBatchModal,
  onClearSelection,
  lang,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none animate-in slide-in-from-bottom-5 duration-200">
      <div className="pointer-events-auto flex items-center gap-3 py-2.5 px-4 bg-neutral-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-neutral-800 text-xs">
        <div className="flex items-center gap-2 pr-2 border-r border-neutral-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {lang === 'bn'
              ? `${selectedCount} টি আইকন সিলেক্টেড`
              : `${selectedCount} ${selectedCount === 1 ? 'icon' : 'icons'} selected`}
          </span>
        </div>

        <button
          onClick={onOpenBatchModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'ZIP ডাউনলোড করুন' : 'Export as ZIP'}</span>
        </button>

        <button
          onClick={onClearSelection}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
