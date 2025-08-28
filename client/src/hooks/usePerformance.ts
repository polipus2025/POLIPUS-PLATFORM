import { useEffect, useCallback, useRef, useState } from 'react';

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>();
  const mountTime = useRef<number>();

  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - (renderStartTime.current || 0);
      if (renderTime > 16) { // Warn if render takes longer than 1 frame
        console.warn(`⚡ Performance: ${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  useEffect(() => {
    mountTime.current = performance.now();
    
    return () => {
      const totalTime = performance.now() - (mountTime.current || 0);
      console.log(`⚡ Performance: ${componentName} total time ${totalTime.toFixed(2)}ms`);
    };
  }, [componentName]);
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  targetRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [targetRef, options]);

  return isIntersecting;
}

// Preload hook for resources
export function usePreload() {
  const preloadedResources = useRef(new Set<string>());

  const preloadRoute = useCallback((routeImport: () => Promise<any>) => {
    routeImport().catch(() => {});
  }, []);

  const preloadImage = useCallback((src: string) => {
    if (preloadedResources.current.has(src)) return;
    
    const img = new Image();
    img.src = src;
    preloadedResources.current.add(src);
  }, []);

  const preloadScript = useCallback((src: string) => {
    if (preloadedResources.current.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = src;
    document.head.appendChild(link);
    preloadedResources.current.add(src);
  }, []);

  return { preloadRoute, preloadImage, preloadScript };
}

// FPS monitoring
export function useFPSMonitor() {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fps = useRef(60);

  useEffect(() => {
    let animationId: number;

    const updateFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        fps.current = Math.round(frameCount.current * 1000 / (currentTime - lastTime.current));
        frameCount.current = 0;
        lastTime.current = currentTime;
        
        if (fps.current < 30) {
          console.warn(`⚡ Performance: Low FPS detected (${fps.current})`);
        }
      }
      
      animationId = requestAnimationFrame(updateFPS);
    };

    animationId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return fps.current;
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
        });
        
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
          console.warn('⚡ Performance: High memory usage detected');
        }
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}