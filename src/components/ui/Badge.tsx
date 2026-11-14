import React from 'react';
import { PriorityLevel, ReportStatus, ReportCategory } from '../../types/report';

interface PriorityBadgeProps {
  level: PriorityLevel;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  level,
  score,
  showScore = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold'
  }[size];

  // Exact template colors: pastel peach for High/Critical, soft amber for Medium, soft mint for Low
  const levelStyles = {
    High: 'bg-[#F6EBEA] text-[#8B2626] border-[#F0D5D3]',
    Medium: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    Low: 'bg-[#D7EFE2] text-[#184E34] border-[#BDE5D0]'
  }[level];

  const dotColors = {
    High: 'bg-[#C62828]',
    Medium: 'bg-[#D97706]',
    Low: 'bg-[#2E7D32]'
  }[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs tracking-tight ${sizeClasses} ${levelStyles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />
      <span>{level} Priority</span>
      {showScore && score !== undefined && (
        <span className="font-mono opacity-75 text-[10px]">({score})</span>
      )}
    </span>
  );
};

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold'
  }[size];

  // Template pastel status styling: Lavender, Mint, Peach, Soft Slate
  const statusStyles: Record<ReportStatus, string> = {
    Reported: 'bg-[#F4F5F6] text-[#475569] border-[#E2E8F0]',
    Verified: 'bg-[#D9CEF3] text-[#2C204B] border-[#C8B8EB]',
    Assigned: 'bg-[#E8E1F7] text-[#3B2D60] border-[#D6C7F1]',
    'In Progress': 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    Fixed: 'bg-[#D7EFE2] text-[#184E34] border-[#BDE5D0]',
    Reopened: 'bg-[#F6EBEA] text-[#8B2626] border-[#F0D5D3] animate-pulse'
  };

  const dotColors: Record<ReportStatus, string> = {
    Reported: 'bg-slate-400',
    Verified: 'bg-[#7C3AED]',
    Assigned: 'bg-[#9333EA]',
    'In Progress': 'bg-[#D97706]',
    Fixed: 'bg-[#16A34A]',
    Reopened: 'bg-[#DC2626]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs tracking-tight ${sizeClasses} ${statusStyles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      <span>{status}</span>
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: ReportCategory }> = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-nest-charcoal border border-gray-200 shadow-xs">
      {category}
    </span>
  );
};
