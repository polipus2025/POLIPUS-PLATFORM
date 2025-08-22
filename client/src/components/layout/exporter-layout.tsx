import { memo, ReactNode } from 'react';
import ExporterSidebar from './exporter-sidebar';

interface ExporterLayoutProps {
  children: ReactNode;
  user?: any;
}

const ExporterLayout = memo(({ children, user }: ExporterLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex">
        {/* Sidebar Navigation */}
        <ExporterSidebar user={user} />
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
});

ExporterLayout.displayName = 'ExporterLayout';
export default ExporterLayout;