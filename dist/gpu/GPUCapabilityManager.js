/**
 * GPUCapabilityManager
 *
 * Handles WebGPU detection, initialization, and capability management.
 * Provides a singleton interface for GPU resource access throughout the application.
 */
export class GPUCapabilityManager {
    constructor() {
        Object.defineProperty(this, "_adapter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_device", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_capabilities", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_initPromise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_initialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    static getInstance() {
        if (!GPUCapabilityManager.instance) {
            GPUCapabilityManager.instance = new GPUCapabilityManager();
        }
        return GPUCapabilityManager.instance;
    }
    /**
     * Check if WebGPU is available in this browser
     */
    static async isWebGPUAvailable() {
        if (typeof navigator === "undefined")
            return false;
        if (!("gpu" in navigator))
            return false;
        try {
            const adapter = await navigator.gpu.requestAdapter();
            return adapter !== null;
        }
        catch {
            return false;
        }
    }
    /**
     * Initialize WebGPU adapter and device
     * Returns true if successful, false otherwise
     */
    async initialize() {
        // Return cached promise if already initializing
        if (this._initPromise) {
            return this._initPromise;
        }
        this._initPromise = this._doInitialize();
        return this._initPromise;
    }
    async _doInitialize() {
        if (this._initialized) {
            return this._device !== null;
        }
        try {
            // Check for WebGPU support
            if (!navigator.gpu) {
                console.warn("[GPUCapabilityManager] WebGPU not supported in this browser");
                this._initialized = true;
                return false;
            }
            // Request adapter
            this._adapter = await navigator.gpu.requestAdapter({
                powerPreference: "high-performance",
            });
            if (!this._adapter) {
                console.warn("[GPUCapabilityManager] Failed to get GPU adapter");
                this._initialized = true;
                return false;
            }
            // Request device with required features
            const requiredLimits = {};
            // Request maximum storage buffer size for large geometry data
            const adapterLimits = this._adapter.limits;
            requiredLimits.maxStorageBufferBindingSize = adapterLimits.maxStorageBufferBindingSize;
            requiredLimits.maxComputeWorkgroupsPerDimension =
                adapterLimits.maxComputeWorkgroupsPerDimension;
            this._device = await this._adapter.requestDevice({
                requiredLimits,
            });
            if (!this._device) {
                console.warn("[GPUCapabilityManager] Failed to get GPU device");
                this._initialized = true;
                return false;
            }
            // Set up device lost handler
            this._device.lost.then((info) => {
                console.error("[GPUCapabilityManager] GPU device lost:", info.message);
                this._device = null;
                this._initialized = false;
                this._initPromise = null;
            });
            // Cache capabilities
            this._capabilities = {
                webgpu: true,
                maxStorageBufferBindingSize: this._device.limits.maxStorageBufferBindingSize,
                maxComputeWorkgroupsPerDimension: this._device.limits.maxComputeWorkgroupsPerDimension,
                maxComputeInvocationsPerWorkgroup: this._device.limits.maxComputeInvocationsPerWorkgroup,
                maxComputeWorkgroupSizeX: this._device.limits.maxComputeWorkgroupSizeX,
                maxComputeWorkgroupSizeY: this._device.limits.maxComputeWorkgroupSizeY,
                maxComputeWorkgroupSizeZ: this._device.limits.maxComputeWorkgroupSizeZ,
            };
            console.log("[GPUCapabilityManager] WebGPU initialized successfully");
            console.log("[GPUCapabilityManager] Device limits:", {
                maxStorageBufferBindingSize: `${(this._capabilities.maxStorageBufferBindingSize / 1024 / 1024).toFixed(1)} MB`,
                maxComputeWorkgroupsPerDimension: this._capabilities.maxComputeWorkgroupsPerDimension,
                maxComputeInvocationsPerWorkgroup: this._capabilities.maxComputeInvocationsPerWorkgroup,
            });
            this._initialized = true;
            return true;
        }
        catch (error) {
            console.error("[GPUCapabilityManager] WebGPU initialization failed:", error);
            this._initialized = true;
            return false;
        }
    }
    /**
     * Get the GPU adapter (requires initialization)
     */
    get adapter() {
        return this._adapter;
    }
    /**
     * Get the GPU device (requires initialization)
     */
    get device() {
        return this._device;
    }
    /**
     * Get cached GPU capabilities
     */
    get capabilities() {
        return this._capabilities;
    }
    /**
     * Check if WebGPU is ready to use
     */
    get isReady() {
        return this._initialized && this._device !== null;
    }
    /**
     * Create a GPU buffer
     */
    createBuffer(size, usage, label) {
        if (!this._device) {
            console.warn("[GPUCapabilityManager] Cannot create buffer: device not initialized");
            return null;
        }
        return this._device.createBuffer({
            size,
            usage,
            label,
            mappedAtCreation: false,
        });
    }
    /**
     * Create a storage buffer with initial data
     */
    createStorageBuffer(data, label) {
        if (!this._device) {
            console.warn("[GPUCapabilityManager] Cannot create storage buffer: device not initialized");
            return null;
        }
        const buffer = this._device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
            label,
            mappedAtCreation: true,
        });
        const mappedRange = buffer.getMappedRange();
        if (data instanceof ArrayBuffer) {
            new Uint8Array(mappedRange).set(new Uint8Array(data));
        }
        else {
            new Uint8Array(mappedRange).set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
        }
        buffer.unmap();
        return buffer;
    }
    /**
     * Write data to an existing buffer
     */
    writeBuffer(buffer, data, offset = 0) {
        if (!this._device) {
            console.warn("[GPUCapabilityManager] Cannot write buffer: device not initialized");
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._device.queue.writeBuffer(buffer, offset, data);
    }
    /**
     * Read data from a GPU buffer back to CPU
     */
    async readBuffer(buffer, size) {
        if (!this._device) {
            throw new Error("[GPUCapabilityManager] Cannot read buffer: device not initialized");
        }
        const readSize = size ?? buffer.size;
        // Create a staging buffer for reading
        const stagingBuffer = this._device.createBuffer({
            size: readSize,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            label: "staging-read-buffer",
        });
        // Copy from source to staging
        const commandEncoder = this._device.createCommandEncoder();
        commandEncoder.copyBufferToBuffer(buffer, 0, stagingBuffer, 0, readSize);
        this._device.queue.submit([commandEncoder.finish()]);
        // Map and read
        await stagingBuffer.mapAsync(GPUMapMode.READ);
        const copyArrayBuffer = stagingBuffer.getMappedRange().slice(0);
        stagingBuffer.unmap();
        stagingBuffer.destroy();
        return copyArrayBuffer;
    }
    /**
     * Dispose of GPU resources
     */
    dispose() {
        if (this._device) {
            this._device.destroy();
            this._device = null;
        }
        this._adapter = null;
        this._capabilities = null;
        this._initialized = false;
        this._initPromise = null;
        console.log("[GPUCapabilityManager] Disposed");
    }
}
Object.defineProperty(GPUCapabilityManager, "instance", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
// Export singleton instance
export const gpuCapabilityManager = GPUCapabilityManager.getInstance();
