import * as THREE from "three";
export interface MemorySnapshot {
    timestamp: number;
    jsHeapSize: number;
    jsHeapSizeLimit: number;
    usedJSHeapSize: number;
    geometryCount: number;
    textureCount: number;
    materialCount: number;
    vertexCount: number;
    indexCount: number;
    bufferMemoryEstimate: number;
    customData?: Record<string, any>;
}
export interface TimingData {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    parentOperation?: string;
    metadata?: Record<string, any>;
}
export interface BlockProcessingData {
    blockType: string;
    position: [number, number, number];
    processingTime: number;
    geometryVertices: number;
    memoryUsed: number;
    chunkId: string;
}
export interface ChunkRenderingPhase {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    memoryBefore: number;
    memoryAfter?: number;
    metadata?: Record<string, any>;
}
export interface ChunkProcessingData {
    chunkId: string;
    chunkCoords: [number, number, number];
    blockCount: number;
    processingTime: number;
    meshCount: number;
    totalVertices: number;
    totalIndices: number;
    memoryUsed: number;
    materialGroups: number;
    blockTypes: string[];
    renderingPhases: ChunkRenderingPhase[];
    blockTypeTimings: Map<string, {
        count: number;
        totalTime: number;
        avgTime: number;
        maxTime: number;
    }>;
    geometryStats: {
        facesCulled: number;
        facesGenerated: number;
        cullingEfficiency: number;
        averageVerticesPerBlock: number;
        textureAtlasUsage: string[];
    };
    memoryBreakdown: {
        vertexBuffers: number;
        indexBuffers: number;
        materials: number;
        textures: number;
        other: number;
    };
}
export interface RendererStats {
    timestamp: number;
    drawCalls: number;
    triangles: number;
    points: number;
    lines: number;
    geometries: number;
    textures: number;
    programs: number;
}
export interface FrameData {
    timestamp: number;
    duration: number;
    fps: number;
}
export interface MeshBuildingSession {
    sessionId: string;
    schematicId: string;
    startTime: number;
    endTime?: number;
    totalDuration?: number;
    renderMode: "immediate" | "incremental" | "instanced";
    memorySnapshots: MemorySnapshot[];
    peakMemoryUsage: number;
    memoryLeaks: number;
    timingData: TimingData[];
    blockProcessingData: BlockProcessingData[];
    chunkProcessingData: ChunkProcessingData[];
    averageBlockProcessingTime: number;
    averageChunkProcessingTime: number;
    slowestOperations: TimingData[];
    memoryHotspots: string[];
    breakdown?: {
        operationId: string;
        duration: number;
        memoryDelta: number;
    }[];
    rendererStats?: {
        drawCalls: number;
        triangles: number;
        points: number;
        lines: number;
        geometries: number;
        textures: number;
        programs: number;
    };
    rendererStatsHistory: RendererStats[];
    frameHistory: FrameData[];
    fpsHistory: number[];
    averageFPS: number;
}
export declare class PerformanceMonitor {
    private static instance;
    private sessions;
    private currentSession;
    private renderer;
    private memoryCheckInterval;
    private memoryIntervalId;
    private baselineMemory;
    private frameCount;
    private lastTime;
    private fpsIntervalId;
    private frameId;
    private isMonitoring;
    private latestFrameTime;
    private latestFPS;
    private timingStack;
    private constructor();
    static getInstance(): PerformanceMonitor;
    setRenderer(renderer: THREE.WebGLRenderer): void;
    startSession(schematicId: string, renderMode: "immediate" | "incremental" | "instanced" | "batched"): string;
    endSession(sessionId?: string): MeshBuildingSession | null;
    startBackgroundMonitoring(): void;
    stopBackgroundMonitoring(): void;
    private trackMemoryLeaks;
    private identifyUnreleasedObjects;
    logMemoryAnalysis(sessionId: string): void;
    startOperation(name: string, metadata?: Record<string, any>): void;
    endOperation(name: string): void;
    recordOperationDetails(operationName: string, details: Record<string, any>): void;
    recordBlockProcessing(data: BlockProcessingData): void;
    recordChunkProcessing(data: ChunkProcessingData): void;
    takeMemorySnapshot(label: string): MemorySnapshot;
    private estimateBufferMemory;
    private startMemoryMonitoring;
    private stopMemoryMonitoring;
    private calculateSessionMetrics;
    private identifyMemoryHotspots;
    getSession(sessionId: string): MeshBuildingSession | null;
    getAllSessions(): MeshBuildingSession[];
    getCurrentSession(): MeshBuildingSession | null;
    exportSessionData(sessionId: string): string;
    clearSessions(): void;
    /**
     * Clear all sessions and reset all performance monitoring data
     */
    clearAllSessions(): void;
    getMemoryUsageOverTime(sessionId: string): {
        time: number;
        memory: number;
    }[];
    getOperationTimings(sessionId: string): {
        name: string;
        duration: number;
        count: number;
    }[];
    getBlockProcessingStats(sessionId: string): {
        blockType: string;
        averageTime: number;
        count: number;
    }[];
    private startMonitoringLoop;
    private stopMonitoringLoop;
    getCurrentFPS(): number;
    getCurrentFrameTime(): number;
    getAverageFPS(): number;
    getFPSHistory(sessionId?: string): number[];
}
export declare const performanceMonitor: PerformanceMonitor;
//# sourceMappingURL=PerformanceMonitor.d.ts.map