// ⚡ GLOBAL PERFORMANCE OPTIMIZATIONS FOR EXPORTER PORTAL

import { memo } from 'react';

// ⚡ FAST LOADING COMPONENT
export const FastLoader = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-slate-600 font-medium">Loading...</p>
    </div>
  </div>
));
FastLoader.displayName = 'FastLoader';

// ⚡ SKELETON LOADER FOR CARDS
export const CardSkeleton = memo(() => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-6 w-1/4 rounded mb-4"></div>
    <div className="space-y-3">
      <div className="bg-gray-200 h-4 rounded"></div>
      <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
      <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
    </div>
  </div>
));
CardSkeleton.displayName = 'CardSkeleton';

// ⚡ PERFORMANCE METRICS FOR MONITORING
export const performanceMetrics = {
  // Track component render time
  measureRenderTime: (componentName: string, renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
  },
  
  // Cache size monitoring
  getCacheSize: () => {
    if (window.performance && (window.performance as any).memory) {
      return (window.performance as any).memory.usedJSHeapSize;
    }
    return 'N/A';
  }
};