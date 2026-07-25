import React, { useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';

interface SafeChartProps {
  children: React.ReactNode;
  height?: number | string;
  minHeight?: number;
}

export const SafeChart: React.FC<SafeChartProps> = ({
  children,
  height = "100%",
  minHeight = 300
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure container is measured by the browser
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const wrapperStyle: React.CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    minHeight: `${minHeight}px`,
    width: '100%',
  };

  if (!isReady) {
    return (
      <div
        style={wrapperStyle}
        className="flex flex-col items-center justify-center bg-[#f9fafb] rounded-lg animate-pulse border border-[#e5e7eb] border-dashed"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-[#2563eb] border-t-transparent animate-spin" />
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">
            Initializing Visualization
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={1}
        minHeight={minHeight}
        debounce={50}
      >
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
};
