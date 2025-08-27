import React, { useEffect, useRef } from 'react';

export default function BasicHtmlMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create iframe with our test HTML
    const iframe = document.createElement('iframe');
    iframe.src = '/test-map.html';
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.style.border = '1px solid #ccc';
    iframe.style.borderRadius = '8px';
    
    containerRef.current.appendChild(iframe);

    return () => {
      if (containerRef.current && iframe.parentNode) {
        containerRef.current.removeChild(iframe);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Basic HTML Map Test</h4>
        <p className="text-sm text-yellow-800">
          This test uses plain HTML and JavaScript to verify if Leaflet maps work in your environment.
          If this map loads successfully, we can identify the issue with our React implementation.
        </p>
      </div>
      <div ref={containerRef} />
    </div>
  );
}