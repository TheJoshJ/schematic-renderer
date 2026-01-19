import * as THREE from "three";
import { MaterialRegistry } from "../MaterialRegistry";
/**
 * Memory Leak Fix Utility
 * Provides comprehensive resource cleanup and memory management fixes
 */
export class MemoryLeakFix {
    constructor() {
        Object.defineProperty(this, "disposedObjects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new WeakSet()
        });
        Object.defineProperty(this, "disposedMaterials", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new WeakSet()
        });
        Object.defineProperty(this, "disposedGeometries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new WeakSet()
        });
    }
    static getInstance() {
        if (!MemoryLeakFix.instance) {
            MemoryLeakFix.instance = new MemoryLeakFix();
        }
        return MemoryLeakFix.instance;
    }
    /**
     * Safely dispose of a Three.js mesh and all its resources
     */
    static disposeMesh(mesh) {
        const instance = MemoryLeakFix.getInstance();
        if (instance.disposedObjects.has(mesh)) {
            console.warn("Attempting to dispose already disposed mesh");
            return;
        }
        // Remove from parent if still attached
        if (mesh.parent) {
            mesh.parent.remove(mesh);
        }
        // Dispose geometry
        if (mesh.geometry && !instance.disposedGeometries.has(mesh.geometry)) {
            mesh.geometry.dispose();
            instance.disposedGeometries.add(mesh.geometry);
        }
        // Handle materials
        if (mesh.material) {
            instance.disposeMaterial(mesh.material);
        }
        // Special handling for InstancedMesh
        if (mesh instanceof THREE.InstancedMesh) {
            // Clear instance matrix (instanceMatrix is a BufferAttribute, not InstancedBufferAttribute)
            if (mesh.instanceMatrix && "dispose" in mesh.instanceMatrix) {
                mesh.instanceMatrix.dispose();
            }
            if (mesh.instanceColor && "dispose" in mesh.instanceColor) {
                mesh.instanceColor.dispose();
            }
        }
        // Mark as disposed
        instance.disposedObjects.add(mesh);
    }
    /**
     * Dispose materials with proper reference counting
     */
    disposeMaterial(material) {
        if (Array.isArray(material)) {
            material.forEach((m) => this.disposeSingleMaterial(m));
        }
        else {
            this.disposeSingleMaterial(material);
        }
    }
    disposeSingleMaterial(material) {
        if (this.disposedMaterials.has(material)) {
            return;
        }
        // Try to release from MaterialRegistry first
        try {
            MaterialRegistry.releaseMaterial(material);
        }
        catch (error) {
            // If not in registry, dispose directly
            material.dispose();
            // Dispose textures if they exist (with proper type checking)
            const materialAny = material;
            if (materialAny.map && typeof materialAny.map.dispose === "function") {
                materialAny.map.dispose();
            }
            if (materialAny.normalMap && typeof materialAny.normalMap.dispose === "function") {
                materialAny.normalMap.dispose();
            }
            if (materialAny.roughnessMap && typeof materialAny.roughnessMap.dispose === "function") {
                materialAny.roughnessMap.dispose();
            }
            if (materialAny.metalnessMap && typeof materialAny.metalnessMap.dispose === "function") {
                materialAny.metalnessMap.dispose();
            }
            if (materialAny.emissiveMap && typeof materialAny.emissiveMap.dispose === "function") {
                materialAny.emissiveMap.dispose();
            }
        }
        this.disposedMaterials.add(material);
    }
    /**
     * Deep disposal of a Three.js group and all its children
     */
    static disposeGroup(group) {
        const instance = MemoryLeakFix.getInstance();
        if (instance.disposedObjects.has(group)) {
            console.warn("Attempting to dispose already disposed group");
            return;
        }
        // Recursively dispose all children
        const children = [...group.children]; // Create copy to avoid mutation during iteration
        children.forEach((child) => {
            if (child instanceof THREE.Mesh || child instanceof THREE.InstancedMesh) {
                MemoryLeakFix.disposeMesh(child);
            }
            else if (child instanceof THREE.Group) {
                MemoryLeakFix.disposeGroup(child);
            }
            else {
                // Generic Three.js object cleanup
                if (child.parent) {
                    child.parent.remove(child);
                }
            }
        });
        // Clear the group
        group.clear();
        // Remove from parent if still attached
        if (group.parent) {
            group.parent.remove(group);
        }
        instance.disposedObjects.add(group);
        console.log(`🗑️ Disposed group with ${children.length} children: ${group.uuid}`);
    }
    /**
     * Force garbage collection if available (Chrome DevTools)
     * Note: Requires Chrome launched with --js-flags="--expose-gc" or --enable-precise-memory-info
     */
    static forceGarbageCollection() {
        if (window.gc) {
            window.gc();
        }
        else if (!MemoryLeakFix.hasWarnedAboutGC) {
            // Only warn once to avoid spam
            MemoryLeakFix.hasWarnedAboutGC = true;
            console.debug('[MemoryLeakFix] GC not exposed. For accurate memory profiling, run Chrome with --js-flags="--expose-gc"');
        }
        // Silent no-op if GC unavailable - this is normal for most browser sessions
    }
    /**
     * Clear all registries and force cleanup
     */
    static clearAllCaches() {
        // Clear MaterialRegistry
        MaterialRegistry.clear();
        // Clear Three.js cache
        THREE.Cache.clear();
        // Force GC
        MemoryLeakFix.forceGarbageCollection();
    }
    /**
     * Monitor memory usage and log warnings
     */
    static monitorMemory() {
        const performanceAny = performance;
        if (performanceAny.memory) {
            const memory = {
                used: Math.round(performanceAny.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performanceAny.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performanceAny.memory.jsHeapSizeLimit / 1024 / 1024),
            };
            // Log warning if memory usage is high
            if (memory.used > 1000) {
                // 1GB
                console.warn(`⚠️ High memory usage detected: ${memory.used}MB / ${memory.limit}MB`);
            }
            return memory;
        }
        return null;
    }
    /**
     * Enhanced mesh disposal for complex objects with proper cleanup
     */
    static disposeComplexMesh(mesh) {
        // Standard disposal
        MemoryLeakFix.disposeMesh(mesh);
        // Additional cleanup for complex meshes
        if (mesh.userData) {
            // Clear user data that might hold references
            mesh.userData = {};
        }
        // Clear any event listeners (if they exist)
        if (mesh.removeEventListener) {
            // Remove common event listeners that might exist
            const events = ["added", "removed"];
            events.forEach((event) => {
                try {
                    mesh.removeEventListener(event, () => { });
                }
                catch (e) {
                    // Event might not exist, ignore
                }
            });
        }
    }
    /**
     * Diagnostic function to identify potential memory leaks
     */
    static diagnoseMemoryUsage() {
        const stats = {
            geometries: 0,
            materials: 0,
            textures: 0,
            programs: 0,
        };
        // Check WebGL renderer info if available
        const renderers = document.querySelectorAll("canvas");
        renderers.forEach((canvas) => {
            const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
            if (gl) {
                // Try to get Three.js renderer info
                const renderer = canvas.renderer;
                if (renderer && renderer.info) {
                    stats.geometries += renderer.info.memory.geometries;
                    stats.materials += renderer.info.memory.textures;
                    stats.programs += renderer.info.programs?.length || 0;
                }
            }
        });
        // Log MaterialRegistry stats
        const materialStats = MaterialRegistry.getStats();
        console.log("Material Registry Stats:", materialStats);
        console.log("Memory Diagnosis:", stats);
        return stats;
    }
}
// Track if we've already warned about GC unavailability
Object.defineProperty(MemoryLeakFix, "hasWarnedAboutGC", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
// Export convenience functions
export const disposeMesh = MemoryLeakFix.disposeMesh;
export const disposeGroup = MemoryLeakFix.disposeGroup;
export const forceGarbageCollection = MemoryLeakFix.forceGarbageCollection;
export const clearAllCaches = MemoryLeakFix.clearAllCaches;
export const monitorMemory = MemoryLeakFix.monitorMemory;
if (typeof window !== "undefined") {
    window.memoryLeakFix = MemoryLeakFix;
    window.disposeMesh = disposeMesh;
    window.disposeGroup = disposeGroup;
    window.clearAllCaches = clearAllCaches;
    window.monitorMemory = monitorMemory;
}
