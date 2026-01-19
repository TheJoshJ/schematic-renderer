/**
 * SharedMemoryManager
 *
 * Manages SharedArrayBuffer pools for zero-copy communication between
 * the main thread and Web Workers. Falls back to regular ArrayBuffers
 * if SharedArrayBuffer is not available.
 */
export declare const isSharedArrayBufferAvailable: () => boolean;
/**
 * Memory block descriptor - describes a region of shared memory
 */
export interface MemoryBlock {
    buffer: SharedArrayBuffer | ArrayBuffer;
    byteOffset: number;
    byteLength: number;
    isShared: boolean;
}
/**
 * Chunk input data layout in shared memory
 *
 * Layout (all values in bytes):
 * [0-3]   : blockCount (uint32)
 * [4-7]   : originX (int32)
 * [8-11]  : originY (int32)
 * [12-15] : originZ (int32)
 * [16...] : blocks data (int32 x 4 per block: x, y, z, paletteIndex)
 */
export declare const CHUNK_INPUT_HEADER_SIZE = 16;
export declare const BYTES_PER_BLOCK = 16;
/**
 * Chunk output data layout in shared memory
 *
 * Layout:
 * [0-3]   : status (uint32): 0=pending, 1=complete, 2=error
 * [4-7]   : vertexCount (uint32)
 * [8-11]  : indexCount (uint32)
 * [12-15] : groupCount (uint32)
 * [16-19] : originX (int32)
 * [20-23] : originY (int32)
 * [24-27] : originZ (int32)
 * [28...] : vertex data (positions: int16 x 3, normals: int8 x 3, uvs: float32 x 2 per vertex)
 * [...] : index data (uint16 or uint32 depending on vertexCount)
 * [...] : group data (start: uint32, count: uint32, materialIndex: uint32 per group)
 */
export declare const CHUNK_OUTPUT_HEADER_SIZE = 28;
export declare const BYTES_PER_VERTEX = 14;
export declare const BYTES_PER_VERTEX_ALIGNED = 20;
export declare const BYTES_PER_INDEX_16 = 2;
export declare const BYTES_PER_INDEX_32 = 4;
export declare const BYTES_PER_GROUP = 12;
/**
 * SharedMemoryPool - Manages a pool of shared memory buffers
 */
export declare class SharedMemoryPool {
    private isShared;
    private inputBuffers;
    private outputBuffers;
    private _mainInputBuffer;
    private _mainInputSize;
    private _mainOutputBuffer;
    private _mainOutputSize;
    constructor();
    /**
     * Check if we're using shared memory
     */
    usingSharedMemory(): boolean;
    /**
     * Allocate input buffer for chunk data
     */
    allocateInputBuffer(chunkId: string, blockCount: number): {
        buffer: SharedArrayBuffer | ArrayBuffer;
        view: DataView;
        blocksArray: Int32Array;
    };
    /**
     * Allocate output buffer for chunk results
     * Estimates size based on worst-case (no culling)
     */
    allocateOutputBuffer(chunkId: string, maxVertices: number, maxIndices: number, maxGroups?: number): {
        buffer: SharedArrayBuffer | ArrayBuffer;
        view: DataView;
    };
    /**
     * Get input buffer for a chunk
     */
    getInputBuffer(chunkId: string): SharedArrayBuffer | ArrayBuffer | undefined;
    /**
     * Get output buffer for a chunk
     */
    getOutputBuffer(chunkId: string): SharedArrayBuffer | ArrayBuffer | undefined;
    /**
     * Release buffers for a chunk
     */
    releaseBuffers(chunkId: string): void;
    /**
     * Clear all buffers
     */
    clear(): void;
    /**
     * Write chunk input data to a buffer
     */
    writeChunkInput(chunkId: string, blocks: Int32Array, originX: number, originY: number, originZ: number): SharedArrayBuffer | ArrayBuffer;
    /**
     * Read chunk output status
     */
    readOutputStatus(chunkId: string): number;
}
export declare function getSharedMemoryPool(): SharedMemoryPool;
//# sourceMappingURL=SharedMemoryManager.d.ts.map