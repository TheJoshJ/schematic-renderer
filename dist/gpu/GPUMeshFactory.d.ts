/**
 * GPUMeshFactory
 *
 * Creates THREE.js meshes from GPU compute output buffers.
 * Supports both zero-copy GPU path (when using WebGPU renderer)
 * and traditional CPU readback path (for WebGL compatibility).
 */
import * as THREE from "three";
import type { ChunkGeometryData } from "../types";
export interface GPUMeshOptions {
    /** Category for render ordering and material setup */
    category: string;
    /** Chunk world position offset */
    origin: [number, number, number];
    /** Array of materials to use */
    materials: THREE.Material[];
    /** Name prefix for the mesh */
    namePrefix?: string;
    /** Whether to enable frustum culling */
    frustumCulled?: boolean;
}
/**
 * Factory for creating meshes from GPU compute output
 */
export declare class GPUMeshFactory {
    /**
     * Create a mesh from ChunkGeometryData (CPU readback path)
     * This is the standard path that works with both WebGL and WebGPU renderers
     */
    static createMeshFromGeometryData(geoData: ChunkGeometryData, options: GPUMeshOptions): THREE.Mesh;
    /**
     * Create multiple meshes from an array of geometry data
     */
    static createMeshesFromResult(geometries: ChunkGeometryData[], origin: [number, number, number], materials: THREE.Material[]): THREE.Mesh[];
    /**
     * Configure mesh properties based on block category
     */
    static configureMeshForCategory(mesh: THREE.Mesh, category: string): void;
    /**
     * Update an existing mesh's geometry with new data
     * This is more efficient than creating a new mesh when updating chunks
     */
    static updateMeshGeometry(mesh: THREE.Mesh, geoData: ChunkGeometryData): void;
    /**
     * Dispose of a mesh and its geometry
     */
    static disposeMesh(mesh: THREE.Mesh): void;
}
//# sourceMappingURL=GPUMeshFactory.d.ts.map