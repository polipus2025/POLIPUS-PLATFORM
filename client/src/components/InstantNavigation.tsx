import React, { memo, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { usePreload } from '@/hooks/usePerformance';

// Route definitions with their import functions
const routeMap = {
  '/farmer-dashboard': () => import('@/pages/farmer-dashboard'),
  '/buyer-dashboard': () => import('@/pages/agricultural-buyer-dashboard'),
  '/exporter-dashboard': () => import('@/pages/exporter-dashboard'),
  '/warehouse-inspector-dashboard': () => import('@/pages/warehouse-inspector-dashboard'),
  '/port-inspector-dashboard': () => import('@/pages/port-inspector-dashboard'),
  '/unified-land-inspector-dashboard': () => import('@/pages/unified-land-inspector-dashboard'),
  '/regulatory-portal-classic': () => import('@/pages/regulatory-portal-classic'),
  '/ddgaf-dashboard': () => import('@/pages/ddgaf-dashboard'),
  '/ddgots-dashboard': () => import('@/pages/ddgots-dashboard'),
  '/dg-dashboard': () => import('@/pages/dg-dashboard'),
  '/agritrace-admin-portal': () => import('@/pages/agritrace-admin-portal'),
};

interface InstantLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  preloadDelay?: number;
}

// Instant navigation link with aggressive preloading
export const InstantLink = memo(({ 
  to, 
  children, 
  className = '',
  preloadDelay = 50 
}: InstantLinkProps) => {
  const { preloadRoute } = usePreload();
  const [location] = useLocation();

  const handleMouseEnter = useCallback(() => {
    if (to in routeMap && to !== location) {
      setTimeout(() => {
        preloadRoute(routeMap[to as keyof typeof routeMap]);
      }, preloadDelay);
    }
  }, [to, location, preloadRoute, preloadDelay]);

  const handleTouchStart = useCallback(() => {
    if (to in routeMap && to !== location) {
      preloadRoute(routeMap[to as keyof typeof routeMap]);
    }
  }, [to, location, preloadRoute]);

  return (
    <Link
      to={to}
      className={`instant-link ${className}`}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
    >
      {children}
    </Link>
  );
});

InstantLink.displayName = 'InstantLink';

// Preload critical routes on component mount
export const useRoutePreloader = () => {
  const { preloadRoute } = usePreload();

  React.useEffect(() => {
    // Preload most common routes after initial render
    const timer = setTimeout(() => {
      const commonRoutes = [
        routeMap['/farmer-dashboard'],
        routeMap['/buyer-dashboard'],
        routeMap['/exporter-dashboard'],
      ];

      commonRoutes.forEach((routeImport, index) => {
        setTimeout(() => {
          preloadRoute(routeImport);
        }, index * 100);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [preloadRoute]);
};

// Navigation performance metrics
export const NavigationMetrics = memo(() => {
  const [metrics, setMetrics] = React.useState<{
    navigationTime: number;
    loadTime: number;
  } | null>(null);

  React.useEffect(() => {
    const measureNavigation = () => {
      if ('navigation' in performance) {
        const nav = (performance as any).navigation;
        setMetrics({
          navigationTime: nav.domContentLoadedEventEnd - nav.navigationStart,
          loadTime: nav.loadEventEnd - nav.navigationStart,
        });
      }
    };

    if (document.readyState === 'complete') {
      measureNavigation();
    } else {
      window.addEventListener('load', measureNavigation);
      return () => window.removeEventListener('load', measureNavigation);
    }
  }, []);

  if (!metrics || import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded z-50">
      <div>Nav: {metrics.navigationTime.toFixed(0)}ms</div>
      <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
    </div>
  );
});