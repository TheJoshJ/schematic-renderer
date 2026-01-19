import * as THREE from "three";
/**
 * Memory Leak Fix Utility
 * Provides comprehensive resource cleanup and memory management fixes
 */
export declare class MemoryLeakFix {
    private static instance;
    private disposedObjects;
    private disposedMaterials;
    private disposedGeometries;
    private static hasWarnedAboutGC;
    private constructor();
    static getInstance(): MemoryLeakFix;
    /**
     * Safely dispose of a Three.js mesh and all its resources
     */
    static disposeMesh(mesh: THREE.Mesh | THREE.InstancedMesh): void;
    /**
     * Dispose materials with proper reference counting
     */
    private disposeMaterial;
    private disposeSingleMaterial;
    /**
     * Deep disposal of a Three.js group and all its children
     */
    static disposeGroup(group: THREE.Group): void;
    /**
     * Force garbage collection if available (Chrome DevTools)
     * Note: Requires Chrome launched with --js-flags="--expose-gc" or --enable-precise-memory-info
     */
    static forceGarbageCollection(): void;
    /**
     * Clear all registries and force cleanup
     */
    static clearAllCaches(): void;
    /**
     * Monitor memory usage and log warnings
     */
    static monitorMemory(): {
        used: number;
        total: number;
        limit: number;
    } | null;
    /**
     * Enhanced mesh disposal for complex objects with proper cleanup
     */
    static disposeComplexMesh(mesh: THREE.Mesh): void;
    /**
     * Diagnostic function to identify potential memory leaks
     */
    static diagnoseMemoryUsage(): {
        geometries: number;
        materials: number;
        textures: number;
        programs: number;
    };
}
export declare const disposeMesh: typeof MemoryLeakFix.disposeMesh;
export declare const disposeGroup: typeof MemoryLeakFix.disposeGroup;
export declare const forceGarbageCollection: typeof MemoryLeakFix.forceGarbageCollection;
export declare const clearAllCaches: typeof MemoryLeakFix.clearAllCaches;
export declare const monitorMemory: typeof MemoryLeakFix.monitorMemory;
declare global {
    interface Window {
        memoryLeakFix: typeof MemoryLeakFix;
        disposeMesh: typeof disposeMesh;
        disposeGroup: typeof disposeGroup;
        clearAllCaches: typeof clearAllCaches;
        monitorMemory: typeof monitorMemory;
        gc?: () => void;
    }
}
//# sourceMappingURL=MemoryLeakFix.d.ts.map