/**
 * GPUMeshFactory
 *
 * Creates THREE.js meshes from GPU compute output buffers.
 * Supports both zero-copy GPU path (when using WebGPU renderer)
 * and traditional CPU readback path (for WebGL compatibility).
 */
import * as THREE from "three";
// Constants matching compute output format
const POSITION_SCALE = 1024;
/**
 * Convert Int8 normals to Float32 for WebGPU compatibility.
 * WebGPU requires vertex buffer strides to be multiples of 4 bytes.
 */
function convertInt8NormalsToFloat32(int8Normals) {
    const float32Normals = new Float32Array(int8Normals.length);
    for (let i = 0; i < int8Normals.length; i++) {
        float32Normals[i] = int8Normals[i] / 127.0;
    }
    return float32Normals;
}
/**
 * Factory for creating meshes from GPU compute output
 */
export class GPUMeshFactory {
    /**
     * Create a mesh from ChunkGeometryData (CPU readback path)
     * This is the standard path that works with both WebGL and WebGPU renderers
     */
    static createMeshFromGeometryData(geoData, options) {
        const geometry = new THREE.BufferGeometry();
        // Handle quantized positions (Int16Array)
        if (geoData.positions) {
            if (geoData.positions instanceof Int16Array) {
                const posAttr = new THREE.BufferAttribute(geoData.positions, 3, false);
                geometry.setAttribute("position", posAttr);
            }
            else {
                // Float32Array path
                const posAttr = new THREE.BufferAttribute(geoData.positions, 3);
                geometry.setAttribute("position", posAttr);
            }
        }
        // Handle normals - convert Int8 to Float32 for WebGPU compatibility
        if (geoData.normals) {
            if (geoData.normals instanceof Int8Array) {
                const float32Normals = convertInt8NormalsToFloat32(geoData.normals);
                const normAttr = new THREE.BufferAttribute(float32Normals, 3);
                geometry.setAttribute("normal", normAttr);
            }
            else {
                // Already Float32Array
                const normAttr = new THREE.BufferAttribute(geoData.normals, 3);
                geometry.setAttribute("normal", normAttr);
            }
        }
        // UVs are always Float32Array
        if (geoData.uvs) {
            const uvAttr = new THREE.BufferAttribute(geoData.uvs, 2);
            geometry.setAttribute("uv", uvAttr);
        }
        // Indices
        if (geoData.indices) {
            geometry.setIndex(new THREE.BufferAttribute(geoData.indices, 1));
        }
        // Material groups
        if (geoData.groups) {
            for (const group of geoData.groups) {
                geometry.addGroup(group.start, group.count, group.materialIndex);
            }
        }
        // Create mesh
        const mesh = new THREE.Mesh(geometry, options.materials);
        mesh.name = `${options.namePrefix || geoData.category}_chunk`;
        // Apply de-quantization scale for Int16 positions
        if (geoData.positions instanceof Int16Array) {
            const scale = 1.0 / POSITION_SCALE;
            mesh.scale.setScalar(scale);
        }
        // Apply chunk origin offset
        mesh.position.set(options.origin[0], options.origin[1], options.origin[2]);
        // Configure rendering properties
        GPUMeshFactory.configureMeshForCategory(mesh, options.category);
        // Set frustum culling
        mesh.frustumCulled = options.frustumCulled ?? true;
        return mesh;
    }
    /**
     * Create multiple meshes from an array of geometry data
     */
    static createMeshesFromResult(geometries, origin, materials) {
        return geometries.map((geoData) => GPUMeshFactory.createMeshFromGeometryData(geoData, {
            category: geoData.category,
            origin,
            materials,
        }));
    }
    /**
     * Configure mesh properties based on block category
     */
    static configureMeshForCategory(mesh, category) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
            if (!(mat instanceof THREE.Material))
                return;
            switch (category) {
                case "water":
                    mesh.renderOrder = 3;
                    mat.transparent = true;
                    if ("opacity" in mat)
                        mat.opacity = 0.8;
                    break;
                case "transparent":
                    mesh.renderOrder = 2;
                    mat.transparent = true;
                    break;
                case "emissive":
                    mesh.renderOrder = 1;
                    break;
                case "redstone":
                    mesh.userData.isDynamic = true;
                    break;
                default:
                    // solid blocks
                    mesh.renderOrder = 0;
            }
        });
    }
    /**
     * Update an existing mesh's geometry with new data
     * This is more efficient than creating a new mesh when updating chunks
     */
    static updateMeshGeometry(mesh, geoData) {
        const geometry = mesh.geometry;
        // Update positions
        if (geoData.positions) {
            const posAttr = geometry.getAttribute("position");
            if (posAttr && posAttr.array.length === geoData.positions.length) {
                posAttr.array.set(geoData.positions);
                posAttr.needsUpdate = true;
            }
            else {
                // Size changed, need to recreate attribute
                if (geoData.positions instanceof Int16Array) {
                    geometry.setAttribute("position", new THREE.BufferAttribute(geoData.positions, 3, false));
                }
                else {
                    geometry.setAttribute("position", new THREE.BufferAttribute(geoData.positions, 3));
                }
            }
        }
        // Update normals - convert Int8 to Float32 for WebGPU compatibility
        if (geoData.normals) {
            const float32Normals = geoData.normals instanceof Int8Array
                ? convertInt8NormalsToFloat32(geoData.normals)
                : geoData.normals;
            const normAttr = geometry.getAttribute("normal");
            if (normAttr && normAttr.array.length === float32Normals.length) {
                normAttr.array.set(float32Normals);
                normAttr.needsUpdate = true;
            }
            else {
                geometry.setAttribute("normal", new THREE.BufferAttribute(float32Normals, 3));
            }
        }
        // Update UVs
        if (geoData.uvs) {
            const uvAttr = geometry.getAttribute("uv");
            if (uvAttr && uvAttr.array.length === geoData.uvs.length) {
                uvAttr.array.set(geoData.uvs);
                uvAttr.needsUpdate = true;
            }
            else {
                geometry.setAttribute("uv", new THREE.BufferAttribute(geoData.uvs, 2));
            }
        }
        // Update indices
        if (geoData.indices) {
            const indexAttr = geometry.getIndex();
            if (indexAttr && indexAttr.array.length === geoData.indices.length) {
                indexAttr.array.set(geoData.indices);
                indexAttr.needsUpdate = true;
            }
            else {
                geometry.setIndex(new THREE.BufferAttribute(geoData.indices, 1));
            }
        }
        // Update groups
        geometry.clearGroups();
        if (geoData.groups) {
            for (const group of geoData.groups) {
                geometry.addGroup(group.start, group.count, group.materialIndex);
            }
        }
        // Recompute bounding box/sphere
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
    }
    /**
     * Dispose of a mesh and its geometry
     */
    static disposeMesh(mesh) {
        if (mesh.geometry) {
            mesh.geometry.dispose();
        }
        // Note: Materials are typically shared and managed separately
    }
}
