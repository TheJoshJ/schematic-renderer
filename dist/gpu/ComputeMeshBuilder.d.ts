/**
 * ComputeMeshBuilder
 *
 * Uses WebGPU compute shaders to perform geometry merging on the GPU
 * for chunk mesh building. Consolidated buffer layout to fit within
 * WebGPU's 8 storage buffer limit.
 */
import type { ChunkGeometryData, PaletteCache } from "../types";
/**
 * GPU buffer structure for palette geometry data
 */
export interface GPUPaletteData {
    vertexData: Float32Array;
    indices: Uint32Array;
    metadata: Uint32Array;
    totalVertices: number;
    totalIndices: number;
    paletteCount: number;
}
/**
 * Result from GPU compute mesh building
 */
export interface GPUChunkResult {
    geometries: ChunkGeometryData[];
    origin: [number, number, number];
}
export declare class ComputeMeshBuilder {
    private gpuManager;
    private initialized;
    private paletteVertexBuffer;
    private paletteIndicesBuffer;
    private paletteMetadataBuffer;
    private paletteData;
    private computePipeline;
    private bindGroupLayout;
    constructor();
    /**
     * Initialize the compute mesh builder
     */
    initialize(): Promise<boolean>;
    /**
     * Create the WGSL compute shader pipeline
     * Consolidated to use only 7 storage buffers + 1 uniform buffer
     */
    private createComputePipeline;
    /**
     * WGSL compute shader code - simplified and consolidated
     */
    private getComputeShaderCode;
    /**
     * Upload palette geometry data to GPU
     */
    uploadPaletteData(paletteCache: PaletteCache): Promise<void>;
    /**
     * Convert PaletteCache to GPU-compatible interleaved format
     */
    private buildGPUPaletteData;
    private categoryToNumber;
    /**
     * Build chunk mesh using GPU compute
     */
    buildChunk(blocks: Int32Array | number[][], chunkOrigin: [number, number, number], _chunkId: string): Promise<GPUChunkResult | null>;
    /**
     * Check if the builder is ready
     */
    get isReady(): boolean;
    /**
     * Dispose GPU resources
     */
    dispose(): void;
}
//# sourceMappingURL=ComputeMeshBuilder.d.ts.map