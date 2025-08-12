import React from 'react';

interface ModernBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function ModernBackground({ children, className = '' }: ModernBackgroundProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${className}`}>
      {children}
    </div>
  );
}