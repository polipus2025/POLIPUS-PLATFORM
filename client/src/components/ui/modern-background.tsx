import React from 'react';

interface ModernBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'animated' | 'cyberpunk';
}

export default function ModernBackground({ 
  children, 
  variant = 'default' 
}: ModernBackgroundProps) {
  const getBackgroundClass = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
      case 'animated':
        return 'animated-bg';
      case 'cyberpunk':
        return 'bg-gradient-to-br from-gray-900 via-black to-gray-800';
      default:
        return 'bg-gradient-to-br from-slate-50 via-white to-gray-50';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()}`}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQwIDFIMUgwVjBIMXYxWiIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+Cjwvc3ZnPgo=')] opacity-40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}