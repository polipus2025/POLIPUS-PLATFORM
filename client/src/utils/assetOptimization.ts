// Asset optimization utilities for ultra-fast loading

// Preload critical images
export const preloadCriticalImages = () => {
  const criticalImages = [
    '/attached_assets/polipos logo 1_1753394173408.jpg',
    // Add more critical images here
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Lazy load images with intersection observer
export class LazyImageLoader {
  private observer: IntersectionObserver;
  private loadedImages = new Set<string>();

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src && !this.loadedImages.has(src)) {
              img.src = src;
              img.classList.remove('opacity-0');
              img.classList.add('opacity-100', 'transition-opacity', 'duration-300');
              this.loadedImages.add(src);
              this.observer.unobserve(img);
            }
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );
  }

  observe(img: HTMLImageElement) {
    img.classList.add('opacity-0');
    this.observer.observe(img);
  }

  disconnect() {
    this.observer.disconnect();
  }
}

// Font optimization
export const optimizeFonts = () => {
  // Preload critical font files
  const criticalFonts = [
    'Inter-Regular.woff2',
    'Inter-Medium.woff2',
    'Inter-SemiBold.woff2',
  ];

  criticalFonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = `/fonts/${font}`;
    link.crossOrigin = '';
    document.head.appendChild(link);
  });
};

// Critical CSS injection for faster first paint
export const injectCriticalCSS = () => {
  const criticalCSS = `
    .platform-loading {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      animation: pulse 1.5s infinite;
    }
    .instant-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

// Resource hints for better performance
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const externalDomains = [
    '//fonts.googleapis.com',
    '//api.polipusplatform.com',
  ];

  externalDomains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const criticalOrigins = [
    'https://fonts.gstatic.com',
  ];

  criticalOrigins.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = '';
    document.head.appendChild(link);
  });
};

// Initialize all optimizations
export const initializePerformanceOptimizations = () => {
  // Run immediately
  injectCriticalCSS();
  addResourceHints();
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preloadCriticalImages();
      optimizeFonts();
    });
  } else {
    preloadCriticalImages();
    optimizeFonts();
  }
};

// Performance budget monitoring
export const monitorPerformanceBudget = () => {
  if (!('performance' in window)) return;

  const checkBudget = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
      };

      // Log warnings if budget exceeded
      if (metrics.response > 500) {
        console.warn('⚡ Performance Budget: Response time exceeded 500ms');
      }
      if (metrics.dom > 1000) {
        console.warn('⚡ Performance Budget: DOM processing exceeded 1s');
      }
    }
  };

  window.addEventListener('load', checkBudget);
};