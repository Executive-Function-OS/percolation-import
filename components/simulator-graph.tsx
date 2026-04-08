"use client";

import React, { useMemo } from "react";
import type { GraphData } from "@/lib/algorithms/percolation";

interface SimulatorGraphProps {
  graph: GraphData;
  width: number;
  height: number;
}

const CLUSTER_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Emerald
];

export default function SimulatorGraph({ graph, width, height }: SimulatorGraphProps) {
  // Map mathematical [0,1] plane coordinates to SVG pixels
  const mappedNodes = useMemo(() => {
    const padding = 40;
    const w = width - padding * 2;
    const h = height - padding * 2;

    return graph.nodes.map((n) => ({
      ...n,
      px: padding + n.x * w,
      py: padding + n.y * h,
    }));
  }, [graph.nodes, width, height]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, typeof mappedNodes[0]>();
    mappedNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [mappedNodes]);

  return (
    <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl relative w-full h-full flex items-center justify-center">
      <svg width={width} height={height} className="block transition-all duration-300">
        {/* Draw Edges */}
        {graph.edges.map((edge, i) => {
          const source = nodeMap.get(edge.source);
          const target = nodeMap.get(edge.target);
          if (!source || !target) return null;
          
          return (
            <line
              key={`edge-${source.id}-${target.id}-${i}`}
              x1={source.px}
              y1={source.py}
              x2={target.px}
              y2={target.py}
              stroke="#475569" // slate-600
              strokeWidth={edge.weight * 2 + 0.5}
              strokeOpacity={0.4 + edge.weight * 0.4}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Draw Nodes */}
        {mappedNodes.map((node) => {
          // Noise nodes are gray, clustered nodes get a designated color
          const isNoise = node.clusterId === -1 || node.clusterId === undefined;
          const color = isNoise ? "#64748B" : CLUSTER_COLORS[node.clusterId! % CLUSTER_COLORS.length];
          const radius = node.type === "A" ? 14 : 10;
          const stroke = node.type === "A" ? "#F8FAFC" : "none";

          return (
            <g key={`node-${node.id}`} className="transition-all duration-500 ease-out" style={{ transform: `translate(${node.px}px, ${node.py}px)` }}>
               {/* Glow if clustered */}
               {!isNoise && (
                <circle
                  cx={0}
                  cy={0}
                  r={radius * 1.8}
                  fill={color}
                  fillOpacity={0.15}
                />
              )}
              {/* Core shape */}
              <circle 
                cx={0} 
                cy={0} 
                r={radius} 
                fill={color} 
                stroke={stroke} 
                strokeWidth={2}
              />
              {/* Type label */}
              <text
                x={0}
                y={4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={10}
                fontWeight="bold"
                pointerEvents="none"
              >
                {node.type}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
