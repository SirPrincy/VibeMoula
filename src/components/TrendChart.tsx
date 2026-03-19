import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  data: number[];
}

const TrendChart: React.FC<Props> = ({ data }) => {
  const points = useMemo(() => {
    if (data.length < 2) return '';
    
    const width = 450; // Approximated
    const height = 15;
    const margin = 2;
    
    // Calculate balances over time
    const balances: number[] = [];
    let current = 0;
    data.slice().reverse().forEach(val => {
      current += val;
      balances.push(current);
    });

    const max = Math.max(...balances);
    const min = Math.min(...balances);
    const range = (max - min) || 1;

    return balances.map((b, i) => {
      const x = (i / (balances.length - 1)) * (width - 2 * margin) + margin;
      const y = height - ((b - min) / range) * (height - 2 * margin) - margin;
      return `${x},${y}`;
    }).join(' ');
  }, [data]);

  if (data.length < 2) return null;

  return (
    <div style={{ height: '15px', marginTop: '5px' }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 450 15">
        <motion.polyline
          points={points}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

export default TrendChart;
