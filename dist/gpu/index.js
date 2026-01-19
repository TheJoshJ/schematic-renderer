/**
 * GPU Compute Module
 *
 * WebGPU-based compute shaders for accelerated mesh building.
 * Falls back to Web Workers when WebGPU is not available.
 */
export { GPUCapabilityManager, gpuCapabilityManager } from "./GPUCapabilityManager";
export { ComputeMeshBuilder } from "./ComputeMeshBuilder";
export { ChunkComputePipeline, getChunkComputePipeline, disposeChunkComputePipeline, } from "./ChunkComputePipeline";
export { GPUMeshFactory } from "./GPUMeshFactory";
