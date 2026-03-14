"use client";

import { useMemo } from "react";
import type { PercolationNetwork } from "@/lib/percolation";

interface Props {
  network: PercolationNetwork;
  width: number;
  height: number;
}

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  type: "O" | "A" | "I";
  name: string;
}

function computeLayout(
  network: PercolationNetwork,
  width: number,
  height: number
): LayoutNode[] {
  const nodes = Object.values(network.nodes);
  if (nodes.length === 0) return [];

  const padding = 40;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - padding;

  if (nodes.length === 1) {
    return [{ ...nodes[0], x: cx, y: cy }];
  }

  return nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    return {
      ...node,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
}

function nodeColor(type: "O" | "A" | "I") {
  if (type === "O") return "#00D4FF"; // cyan
  if (type === "A") return "#FF6B2B"; // orange
  return "#10B981"; // green
}

export default function NetworkGraph({ network, width, height }: Props) {
  const layoutNodes = useMemo(
    () => computeLayout(network, width, height),
    [network, width, height]
  );

  const nodeMap = useMemo(() => {
    const map: Record<string, LayoutNode> = {};
    layoutNodes.forEach((n) => (map[n.id] = n));
    return map;
  }, [layoutNodes]);

  const maxWeight = useMemo(() => {
    if (network.edges.length === 0) return 1;
    return Math.max(...network.edges.map((e) => e.weight));
  }, [network.edges]);

  return (
    <div className="rounded-xl overflow-hidden bg-[#0F172A]">
      <svg width={width} height={height}>
        {/* Edges */}
        {network.edges.map((edge, i) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;
          const opacity = 0.15 + 0.55 * (edge.weight / maxWeight);
          return (
            <line
              key={`edge-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#64748B"
              strokeWidth={1.5}
              strokeOpacity={opacity}
            />
          );
        })}

        {/* Nodes */}
        {layoutNodes.map((node) => {
          const color = nodeColor(node.type);
          const shortName =
            node.name.length > 10
              ? node.name.substring(0, 9) + "..."
              : node.name;
          return (
            <g key={node.id}>
              {/* Glow effect */}
              <circle
                cx={node.x}
                cy={node.y}
                r={16}
                fill={color}
                fillOpacity={0.2}
              />
              {/* Main node */}
              <circle cx={node.x} cy={node.y} r={10} fill={color} />
              {/* File name label */}
              <text
                x={node.x}
                y={node.y - 18}
                textAnchor="middle"
                fill="#E2E8F0"
                fontSize={10}
                fontWeight={500}
              >
                {shortName}
              </text>
              {/* Type label */}
              <text
                x={node.x}
                y={node.y + 26}
                textAnchor="middle"
                fill="#64748B"
                fontSize={8}
              >
                {node.type === "O"
                  ? "Observer"
                  : node.type === "A"
                    ? "Operator"
                    : "Inert"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
