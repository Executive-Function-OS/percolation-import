// lib/algorithms/percolation.ts
import type { Point } from "./dbscan";

export type Edge = {
  source: string;
  target: string;
  weight: number;
  type: "bridge" | "internal";
};

export type GraphData = {
  nodes: Point[];
  edges: Edge[];
};

/**
 * Creates edges between nodes in the same cluster, and occasional bridge edges between clusters.
 */
export function buildGraphFromClusters(nodes: Point[], connectRadius: number): GraphData {
  const edges: Edge[] = [];
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i];
      const n2 = nodes[j];
      
      const d = Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
      
      if (d <= connectRadius) {
        // Decide if it's a bridge edge or an internal edge
        // An edge attached to an EF node, or spanning between different node types, is fragile.
        let edgeType: "bridge" | "internal" = "internal";
        if (n1.type === "EF" || n2.type === "EF" || n1.type !== n2.type) {
            edgeType = "bridge";
        }

        edges.push({
          source: n1.id,
          target: n2.id,
          weight: 1 - d / connectRadius,
          type: edgeType,
        });
      }
    }
  }
  
  return { nodes, edges };
}

/**
 * Simulates percolation by probabilistically removing edges based on stress level.
 * Bridge edges fail at a higher rate.
 * @param graph Current network
 * @param stress Normalized 0.0 to 1.0 (0 = all stable edges keep, 1 = all edges fail)
 */
export function applyPercolationStress(graph: GraphData, stress: number): GraphData {
  if (stress === 0) return graph;
  
  const retainedEdges = graph.edges.filter((e) => {
    // DeepSeek's suggestion: fragile bridges
    const baseProb = e.type === "bridge" ? stress * 1.5 : stress * 0.8;
    // Cap at 1.0
    const finalProb = Math.min(1.0, baseProb);
    
    // Add some randomness context (a weak weight == easier to break)
    // baseProb acts as the threshold.
    const failureProbability = finalProb * (Math.random() * 0.5 + 0.5); 
    const resistance = e.weight; 
    
    return failureProbability < resistance;
  });
  
  return { nodes: graph.nodes, edges: retainedEdges };
}

/**
 * Analyzes the graph to see if the "Observer" ('O') and "Operator" ('A') sub-networks are disconnected.
 * Returns true if a path exists between ANY Observer node and ANY Operator node.
 */
export function isObserverOperatorConnected(graph: GraphData): boolean {
  const adjacency = new Map<string, string[]>();
  
  graph.nodes.forEach(n => adjacency.set(n.id, []));
  graph.edges.forEach(e => {
    adjacency.get(e.source)?.push(e.target);
    adjacency.get(e.target)?.push(e.source);
  });
  
  // Find all O nodes and A nodes
  const observers = graph.nodes.filter(n => n.type === 'O').map(n => n.id);
  const operators = new Set(graph.nodes.filter(n => n.type === 'A').map(n => n.id));
  
  if (observers.length === 0 || operators.size === 0) return false;
  
  // BFS from all Observer nodes
  const visited = new Set<string>();
  const queue = [...observers];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    
    // Found connection to operator!
    if (operators.has(current)) {
      return true;
    }
    
    const neighbors = adjacency.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  
  return false;
}
