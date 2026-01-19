/**
 * ChunkComputePipeline
 *
 * High-level orchestration for GPU compute-based chunk mesh building.
 * Manages the compute passes (occupancy map + geometry merge) and
 * provides a clean interface for the WorldMeshBuilder.
 */
import * as THREE from "three";
import type { ChunkGeometryData, PaletteCache } from "../types";
export interface ChunkBuildRequest {
    chunkId: string;
    blocks: Int32Array | number[][];
    chunkX: number;
    chunkY: number;
    chunkZ: number;
    chunkSize: number;
}
export interface ChunkBuildResult {
    geometries: ChunkGeometryData[];
    origin: [number, number, number];
    buildTimeMs: number;
}
/**
 * Statistics for GPU compute performance
 */
export interface GPUComputeStats {
    totalChunksBuilt: number;
    totalBuildTimeMs: number;
    averageBuildTimeMs: number;
    lastBuildTimeMs: number;
    gpuMemoryUsed: number;
}
export declare class ChunkComputePipeline {
    private computeMeshBuilder;
    private initialized;
    private paletteUploaded;
    private stats;
    private pendingBuilds;
    private buildingChunks;
    constructor();
    /**
     * Initialize the compute pipeline
     */
    initialize(): Promise<boolean>;
    /**
     * Upload palette data to GPU
     */
    uploadPalette(paletteCache: PaletteCache): Promise<void>;
    /**
     * Build a single chunk using GPU compute
     */
    buildChunk(request: ChunkBuildRequest): Promise<ChunkBuildResult>;
    /**
     * Queue a chunk for building (for potential batching)
     */
    queueChunkBuild(request: ChunkBuildRequest): Promise<ChunkBuildResult>;
    /**
     * Process queued chunk builds
     */
    private processQueue;
    /**
     * Create THREE.js mesh objects from GPU compute result
     */
    createMeshesFromResult(result: ChunkBuildResult, globalMaterials: THREE.Material[]): THREE.Object3D[];
    /**
     * Configure mesh properties based on block category
     */
    private configureMeshForCategory;
    /**
     * Get pipeline statistics
     */
    getStats(): GPUComputeStats;
    /**
     * Reset statistics
     */
    resetStats(): void;
    /**
     * Check if the pipeline is ready
     */
    get isReady(): boolean;
    /**
     * Dispose GPU resources
     */
    dispose(): void;
}
export declare function getChunkComputePipeline(): ChunkComputePipeline;
export declare function disposeChunkComputePipeline(): void;
//# sourceMappingURL=ChunkComputePipeline.d.ts.map