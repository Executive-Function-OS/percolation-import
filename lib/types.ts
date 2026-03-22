// TypeScript interfaces for various data types used in the project

// Interface representing network activity metrics
interface NetworkActivity {
    timestamp: string; // Date and time of the activity in ISO format
    bytesSent: number; // Number of bytes sent
    bytesReceived: number; // Number of bytes received
}

// Interface representing a time window with start and end times
interface TimeWindow {
    startTime: string; // Start time in ISO format
    endTime: string; // End time in ISO format
}

// Interface representing a cluster in DBSCAN algorithm
interface DBSCANCluster {
    points: Array<number[]>; // Array of points in the cluster
    noise: boolean; // Indicator if the cluster contains noise
}

// Interface containing metrics related to percolation
interface PercolationMetrics {
    density: number; // Density of the network
    percolationThreshold: number; // Threshold at which percolation occurs
}

// Interface for system classification metrics
interface SystemClassification {
    classification: string; // Classification label
    confidence: number; // Confidence level of classification
}

// Interface for encompassing research data
interface ResearchData {
    networkActivity: NetworkActivity[]; // Array of network activities
    timeWindow: TimeWindow; // Time window of the research
    clusters: DBSCANCluster[]; // Detected clusters
    metrics: PercolationMetrics; // Percolation metrics
    classification: SystemClassification; // Classification results
}