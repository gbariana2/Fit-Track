'use client';

import { motion } from 'framer-motion';

interface BackgroundPathsProps {
  className?: string;
  pathCount?: number;
}

function generatePath(index: number, total: number): string {
  const spread = 1200;
  const offset = (index / total) * spread - spread / 2;
  const y1 = -500 + Math.abs(offset) * 0.3;
  const cp1x = -350 + offset * 0.85;
  const cp1y = 0 + (index % 3) * 150;
  const cp2x = 350 - offset * 0.55;
  const cp2y = 200 + (index % 4) * 120;
  const ex = 800 + offset * 0.35;
  const ey = -50 - (index % 5) * 80;

  return `M${-600 + offset} ${y1} C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${ex} ${ey}`;
}

export default function BackgroundPaths({ className = '', pathCount = 30 }: BackgroundPathsProps) {
  const paths = Array.from({ length: pathCount }, (_, i) => ({
    id: i,
    d: generatePath(i, pathCount),
    width: 0.8 + (i % 3) * 0.5,
    duration: 12 + (i % 5) * 4,
    dashSize: 80 + (i % 3) * 60,
    gapSize: 200 + (i % 4) * 100,
    peakOpacity: 0.18 + (i % 4) * 0.06,
  }));

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="-600 -500 1200 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <title>Background decoration</title>

        {/* Main flowing paths — dashed strokes that animate along the curve */}
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#38bdf8"
            strokeWidth={path.width}
            strokeLinecap="round"
            strokeDasharray={`${path.dashSize} ${path.gapSize}`}
            fill="none"
            animate={{
              strokeDashoffset: [0, -(path.dashSize + path.gapSize) * 3],
              opacity: [path.peakOpacity * 0.5, path.peakOpacity, path.peakOpacity * 0.5],
            }}
            transition={{
              strokeDashoffset: {
                duration: path.duration,
                repeat: Infinity,
                ease: 'linear',
              },
              opacity: {
                duration: path.duration * 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: (path.id % 6) * 0.8,
              },
            }}
          />
        ))}

        {/* Accent paths — thicker, slower, brighter */}
        {paths.filter((_, i) => i % 5 === 0).map((path) => (
          <motion.path
            key={`accent-${path.id}`}
            d={path.d}
            stroke="#0ea5e9"
            strokeWidth={path.width + 1}
            strokeLinecap="round"
            strokeDasharray={`${path.dashSize * 1.5} ${path.gapSize * 1.5}`}
            fill="none"
            animate={{
              strokeDashoffset: [0, (path.dashSize + path.gapSize) * 3],
              opacity: [0.06, 0.15, 0.06],
            }}
            transition={{
              strokeDashoffset: {
                duration: path.duration + 12,
                repeat: Infinity,
                ease: 'linear',
              },
              opacity: {
                duration: path.duration * 0.7,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: (path.id % 4) * 1.5,
              },
            }}
          />
        ))}
      </svg>
    </div>
  );
}
