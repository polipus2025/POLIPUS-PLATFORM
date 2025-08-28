import { useState, useEffect, useMemo, useRef } from 'react';
import React from 'react';

interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScrolling<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleCount + overscan * 2
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      offsetY: (startIndex + index) * itemHeight,
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;

    const onScroll = () => setScrollTop(element.scrollTop);
    element.addEventListener('scroll', onScroll, { passive: true });
    
    return () => element.removeEventListener('scroll', onScroll);
  }, []);

  return {
    scrollElementRef,
    totalHeight,
    visibleItems,
    handleScroll,
    startIndex,
    endIndex,
  };
}

// Virtual List Component for React
export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => JSX.Element;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  className = '',
}: VirtualListProps<T>): JSX.Element {
  const {
    scrollElementRef,
    totalHeight,
    visibleItems,
    handleScroll,
  } = useVirtualScrolling(items, { itemHeight, containerHeight: height });

  return React.createElement('div', {
    ref: scrollElementRef,
    className: `overflow-auto ${className}`,
    style: { height },
    onScroll: handleScroll,
  }, React.createElement('div', {
    style: { height: totalHeight, position: 'relative' }
  }, visibleItems.map(({ item, index, offsetY }) => 
    React.createElement('div', {
      key: index,
      style: {
        position: 'absolute',
        top: offsetY,
        left: 0,
        right: 0,
        height: itemHeight,
      }
    }, renderItem(item, index))
  )));
}