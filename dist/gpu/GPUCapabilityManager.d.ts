/**
 * GPUCapabilityManager
 *
 * Handles WebGPU detection, initialization, and capability management.
 * Provides a singleton interface for GPU resource access throughout the application.
 */
export interface GPUCapabilities {
    webgpu: boolean;
    maxStorageBufferBindingSize: number;
    maxComputeWorkgroupsPerDimension: number;
    maxComputeInvocationsPerWorkgroup: number;
    maxComputeWorkgroupSizeX: number;
    maxComputeWorkgroupSizeY: number;
    maxComputeWorkgroupSizeZ: number;
}
export declare class GPUCapabilityManager {
    private static instance;
    private _adapter;
    private _device;
    private _capabilities;
    private _initPromise;
    private _initialized;
    private constructor();
    static getInstance(): GPUCapabilityManager;
    /**
     * Check if WebGPU is available in this browser
     */
    static isWebGPUAvailable(): Promise<boolean>;
    /**
     * Initialize WebGPU adapter and device
     * Returns true if successful, false otherwise
     */
    initialize(): Promise<boolean>;
    private _doInitialize;
    /**
     * Get the GPU adapter (requires initialization)
     */
    get adapter(): GPUAdapter | null;
    /**
     * Get the GPU device (requires initialization)
     */
    get device(): GPUDevice | null;
    /**
     * Get cached GPU capabilities
     */
    get capabilities(): GPUCapabilities | null;
    /**
     * Check if WebGPU is ready to use
     */
    get isReady(): boolean;
    /**
     * Create a GPU buffer
     */
    createBuffer(size: number, usage: GPUBufferUsageFlags, label?: string): GPUBuffer | null;
    /**
     * Create a storage buffer with initial data
     */
    createStorageBuffer(data: ArrayBuffer | ArrayBufferView, label?: string): GPUBuffer | null;
    /**
     * Write data to an existing buffer
     */
    writeBuffer(buffer: GPUBuffer, data: BufferSource | SharedArrayBuffer, offset?: number): void;
    /**
     * Read data from a GPU buffer back to CPU
     */
    readBuffer(buffer: GPUBuffer, size?: number): Promise<ArrayBuffer>;
    /**
     * Dispose of GPU resources
     */
    dispose(): void;
}
export declare const gpuCapabilityManager: GPUCapabilityManager;
//# sourceMappingURL=GPUCapabilityManager.d.ts.map