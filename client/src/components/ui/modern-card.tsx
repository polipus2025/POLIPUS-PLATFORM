import React from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function ModernCard({ children, className = '', hover = true }: ModernCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-slate-200 shadow-sm p-6",
      hover && "hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {children}
    </div>
  );
}