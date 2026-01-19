export declare class GeometryBufferPool {
    private static positionPools;
    private static indexPools;
    static getPositionBuffer(size: number): Float32Array;
    static returnPositionBuffer(buffer: Float32Array): void;
    static getIndexBuffer(size: number): Uint32Array;
    static returnIndexBuffer(buffer: Uint32Array): void;
    /**
     * Clear all pooled buffers to free memory
     */
    static clear(): void;
}
//# sourceMappingURL=GeometryBufferPool.d.ts.map