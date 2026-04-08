// lib/algorithms/dbscan.ts

export type Point = {
  id: string;
  x: number;
  y: number;
  type?: "O" | "A" | "EF" | "I"; // Observer, Operator, Executive Function, Inert
  clusterId?: number; // -1 for Noise, otherwise >= 0
};

/**
 * Basic DBSCAN algorithm implementation.
 * @param points Array of data points.
 * @param epsilon Maximum distance (radius) to consider a point a neighbor.
 * @param minPts Minimum number of points required to form a dense region (core point).
 */
export function dbscan(points: Point[], epsilon: number, minPts: number): Point[] {
  let clusterId = 0;
  
  // Reset all cluster assignments
  const resetPoints = points.map(p => ({ ...p, clusterId: undefined }));
  
  for (let i = 0; i < resetPoints.length; i++) {
    const point = resetPoints[i];
    
    // Skip if already categorized
    if (point.clusterId !== undefined) continue;
    
    const neighbors = getNeighbors(resetPoints, point, epsilon);
    
    if (neighbors.length < minPts) {
      point.clusterId = -1; // Mark as noise
    } else {
      // Start a new cluster
      point.clusterId = clusterId;
      expandCluster(resetPoints, neighbors, clusterId, epsilon, minPts);
      clusterId++;
    }
  }
  
  return resetPoints;
}

function expandCluster(points: Point[], neighbors: Point[], clusterId: number, epsilon: number, minPts: number) {
  for (let i = 0; i < neighbors.length; i++) {
    const p = neighbors[i];
    
    // If previously marked as noise, change to edge point of this cluster
    if (p.clusterId === -1) {
      p.clusterId = clusterId;
    }
    
    // If uncategorized, categorize and find its neighbors
    if (p.clusterId === undefined) {
      p.clusterId = clusterId;
      const newNeighbors = getNeighbors(points, p, epsilon);
      if (newNeighbors.length >= minPts) {
        neighbors = neighbors.concat(newNeighbors);
      }
    }
  }
}

function getNeighbors(points: Point[], point: Point, epsilon: number): Point[] {
  return points.filter(p => distance(p, point) <= epsilon);
}

function distance(p1: Point, p2: Point) {
  // Euclidean distance for mathematical simulation of cognitive proximity
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
