import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  fullWidth = false,
  className = ''
}) => {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`p-1.5 bg-[#F7F6F2] border border-[#E5E1D8] rounded-xl flex items-center gap-1 overflow-x-auto no-scrollbar ${
        fullWidth ? 'w-full' : 'w-fit'
      } ${className}`}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79661] ${
              fullWidth ? 'flex-1' : ''
            } ${
              isActive
                ? 'bg-[#142B45] text-[#FFFFFF] shadow-xs'
                : 'text-[#4B5563] hover:text-[#142B45] hover:bg-[#FFFFFF]/60'
            } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {tab.icon && <span className={`shrink-0 ${isActive ? 'text-[#F3D085]' : 'text-[#B79661]'}`}>{tab.icon}</span>}
            <span className={isActive ? 'text-[#FFFFFF] font-bold' : 'text-[#374151]'}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
