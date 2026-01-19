export class GeometryBufferPool {
    static getPositionBuffer(size) {
        let pool = this.positionPools.get(size);
        if (!pool) {
            pool = [];
            this.positionPools.set(size, pool);
        }
        return pool.pop() || new Float32Array(size);
    }
    static returnPositionBuffer(buffer) {
        const size = buffer.length;
        let pool = this.positionPools.get(size);
        if (!pool) {
            pool = [];
            this.positionPools.set(size, pool);
        }
        if (pool.length < 10) {
            // Limit pool size
            pool.push(buffer);
        }
    }
    static getIndexBuffer(size) {
        let pool = this.indexPools.get(size);
        if (!pool) {
            pool = [];
            this.indexPools.set(size, pool);
        }
        return pool.pop() || new Uint32Array(size);
    }
    static returnIndexBuffer(buffer) {
        const size = buffer.length;
        let pool = this.indexPools.get(size);
        if (!pool) {
            pool = [];
            this.indexPools.set(size, pool);
        }
        if (pool.length < 10) {
            pool.push(buffer);
        }
    }
    /**
     * Clear all pooled buffers to free memory
     */
    static clear() {
        this.positionPools.clear();
        this.indexPools.clear();
        console.log("[GeometryBufferPool] Cleared all pooled buffers.");
    }
}
Object.defineProperty(GeometryBufferPool, "positionPools", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
Object.defineProperty(GeometryBufferPool, "indexPools", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
