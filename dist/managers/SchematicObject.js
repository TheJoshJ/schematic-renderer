// managers/SchematicObject.ts
import * as THREE from "three";
import { IoTypeWrapper, LayoutFunctionWrapper, ExecutionModeWrapper, BlockPosition, DefinitionRegionWrapper, CircuitBuilderWrapper, SortStrategyWrapper, } from "../nucleationExports";
import { EventEmitter } from "events";
// Removed unused imports since we're no longer using reactive proxy
import { resetPerformanceMetrics } from "../monitoring";
import { performanceMonitor } from "../performance/PerformanceMonitor";
import { SchematicExporter } from "../export/SchematicExporter";
export class SchematicObject extends EventEmitter {
    constructor(schematicRenderer, name, schematicWrapper, properties) {
        super();
        // ... existing imports and properties ...
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "schematicWrapper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "schematicRenderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "meshes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "worldMeshBuilder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "eventEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sceneManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chunkMeshes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "chunkDimensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                chunkWidth: 16,
                chunkHeight: 16,
                chunkLength: 16,
            }
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "group", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Public properties without underscores
        Object.defineProperty(this, "position", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rotation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "opacity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "visible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "meshBoundingBox", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "renderingBounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Reactive bounds for direct manipulation
        Object.defineProperty(this, "bounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "meshesReady", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Cache for dimensions to avoid repeated calls
        Object.defineProperty(this, "_cachedDimensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "blockEntitiesMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        /**
         * Set up manual property watchers instead of using reactive proxy
         * This avoids interference with Three.js internal matrix properties
         */
        // Timer is assigned in setupPropertyWatchers and used internally
        // @ts-expect-error Timer is assigned and used internally for change detection
        Object.defineProperty(this, "_propertyWatcherTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // ========================================================================
        // Definition Region Methods
        // ========================================================================
        /**
         * Track whether definition regions are currently visible for this schematic
         */
        Object.defineProperty(this, "_definitionRegionsVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.id = name;
        this.name = name;
        this.schematicWrapper = schematicWrapper;
        this.schematicRenderer = schematicRenderer;
        if (!this.schematicRenderer) {
            throw new Error("SchematicRenderer is required.");
        }
        if (!this.schematicRenderer.worldMeshBuilder) {
            throw new Error("WorldMeshBuilder is required.");
        }
        this.worldMeshBuilder = schematicRenderer.worldMeshBuilder;
        this.eventEmitter = schematicRenderer.eventEmitter;
        this.sceneManager = schematicRenderer.sceneManager;
        // Initialize properties with default values
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Euler();
        this.scale = new THREE.Vector3(1, 1, 1);
        this.opacity = 1.0;
        this.visible = properties?.visible ?? true;
        // Set initial properties if provided, avoiding Three.js object conflicts
        if (properties) {
            // Handle Three.js objects carefully
            if (properties.position) {
                if (Array.isArray(properties.position)) {
                    this.position.set(properties.position[0], properties.position[1], properties.position[2]);
                }
                else {
                    this.position.copy(properties.position);
                }
            }
            if (properties.rotation) {
                if (Array.isArray(properties.rotation)) {
                    this.rotation.set(properties.rotation[0], properties.rotation[1], properties.rotation[2]);
                }
                else {
                    this.rotation.copy(properties.rotation);
                }
            }
            if (properties.scale) {
                if (Array.isArray(properties.scale)) {
                    this.scale.set(properties.scale[0], properties.scale[1], properties.scale[2]);
                }
                else if (typeof properties.scale === "number") {
                    this.scale.setScalar(properties.scale);
                }
                else {
                    this.scale.copy(properties.scale);
                }
            }
            if (properties.opacity !== undefined) {
                this.opacity = properties.opacity;
            }
            if (properties.visible !== undefined) {
                this.visible = properties.visible;
            }
        }
        if (this.schematicRenderer.options.chunkSideLength) {
            this.chunkDimensions = {
                chunkWidth: this.schematicRenderer.options.chunkSideLength,
                chunkHeight: this.schematicRenderer.options.chunkSideLength,
                chunkLength: this.schematicRenderer.options.chunkSideLength,
            };
        }
        const schematicDimensions = this.getDimensions();
        const tightDimensions = this.getTightDimensions();
        console.log("Schematic dimensions (allocated):", schematicDimensions);
        console.log("Schematic dimensions (tight bounds):", tightDimensions);
        // Use tight bounds for centering if available, otherwise fall back to allocated dimensions
        const centeringDimensions = tightDimensions[0] > 0 && tightDimensions[1] > 0 && tightDimensions[2] > 0
            ? tightDimensions
            : schematicDimensions;
        console.log("Centering schematic using dimensions:", centeringDimensions);
        this.position = new THREE.Vector3(-centeringDimensions[0] / 2 + 0.5, // Center the schematic
        0.5, -centeringDimensions[2] / 2 + 0.5 // Center the schematic
        );
        if (properties?.meshBoundingBox) {
            this.meshBoundingBox = properties.meshBoundingBox;
        }
        else {
            this.meshBoundingBox = [
                this.position.toArray(),
                this.position
                    .clone()
                    .add(new THREE.Vector3(schematicDimensions[0], schematicDimensions[1], schematicDimensions[2]))
                    .toArray(),
            ];
        }
        // Initialize rendering bounds to the full schematic dimensions
        // But they are disabled by default (they won't be used for culling unless explicitly enabled)
        this.renderingBounds = {
            min: new THREE.Vector3(0, 0, 0),
            max: new THREE.Vector3(schematicDimensions[0], schematicDimensions[1], schematicDimensions[2]),
            enabled: false, // Disabled by default
        };
        // Apply custom rendering bounds if provided
        if (properties?.renderingBounds) {
            if (Array.isArray(properties.renderingBounds.min)) {
                this.renderingBounds.min = new THREE.Vector3(properties.renderingBounds.min[0], properties.renderingBounds.min[1], properties.renderingBounds.min[2]);
            }
            else if (properties.renderingBounds.min instanceof THREE.Vector3) {
                this.renderingBounds.min = properties.renderingBounds.min.clone();
            }
            if (Array.isArray(properties.renderingBounds.max)) {
                this.renderingBounds.max = new THREE.Vector3(properties.renderingBounds.max[0], properties.renderingBounds.max[1], properties.renderingBounds.max[2]);
            }
            else if (properties.renderingBounds.max instanceof THREE.Vector3) {
                this.renderingBounds.max = properties.renderingBounds.max.clone();
            }
        }
        // Initialize the reactive bounds property with safe implementation
        const self = this;
        this.bounds = {
            get minX() {
                return self.renderingBounds.min.x;
            },
            set minX(value) {
                self.renderingBounds.min.x = value;
                self.updateRenderingBounds();
            },
            get maxX() {
                return self.renderingBounds.max.x;
            },
            set maxX(value) {
                self.renderingBounds.max.x = value;
                self.updateRenderingBounds();
            },
            get minY() {
                return self.renderingBounds.min.y;
            },
            set minY(value) {
                self.renderingBounds.min.y = value;
                self.updateRenderingBounds();
            },
            get maxY() {
                return self.renderingBounds.max.y;
            },
            set maxY(value) {
                self.renderingBounds.max.y = value;
                self.updateRenderingBounds();
            },
            get minZ() {
                return self.renderingBounds.min.z;
            },
            set minZ(value) {
                self.renderingBounds.min.z = value;
                self.updateRenderingBounds();
            },
            get maxZ() {
                return self.renderingBounds.max.z;
            },
            set maxZ(value) {
                self.renderingBounds.max.z = value;
                self.updateRenderingBounds();
            },
            get enabled() {
                return self.renderingBounds.enabled || false;
            },
            set enabled(value) {
                self.renderingBounds.enabled = value;
                self.updateRenderingBounds();
                self.showRenderingBoundsHelper(value);
            },
            // Reset to full dimensions
            reset() {
                const dimensions = self.getDimensions();
                self.setRenderingBounds(new THREE.Vector3(0, 0, 0), new THREE.Vector3(dimensions[0], dimensions[1], dimensions[2]));
                return "Reset to full dimensions";
            },
            // Toggle helper visibility
            showHelper(visible = true) {
                self.showRenderingBoundsHelper(visible);
                return `Helper ${visible ? "shown" : "hidden"}`;
            },
            // Apply bounds changes (triggers rebuild)
            apply() {
                self.rebuildMesh();
                return "Bounds applied and mesh rebuilt";
            },
        };
        this.group = new THREE.Group();
        this.group.name = name;
        // Build meshes and other initialization
        this.updateTransform();
        this.sceneManager.add(this.group);
        this.group.visible = this.visible;
        if (this.visible) {
            this.meshesReady = this.buildMeshes();
        }
        else {
            this.meshesReady = Promise.resolve();
        }
        // Instead of proxying the entire object, set up manual property watchers
        // This avoids interfering with Three.js internal matrix properties
        this.setupPropertyWatchers();
    }
    setupPropertyWatchers() {
        // Store original values for comparison
        let lastPosition = this.position.clone();
        let lastRotation = this.rotation.clone();
        let lastScale = this.scale.clone();
        let lastOpacity = this.opacity;
        let lastVisible = this.visible;
        // Set up property change detection
        const checkForChanges = () => {
            // Check position
            if (!this.position.equals(lastPosition)) {
                lastPosition = this.position.clone();
                this.updateTransform();
                this.emitPropertyChanged("position", this.position);
            }
            // Check rotation
            if (!this.rotation.equals(lastRotation)) {
                lastRotation = this.rotation.clone();
                this.updateTransform();
                this.emitPropertyChanged("rotation", this.rotation);
            }
            // Check scale
            if (!this.scale.equals(lastScale)) {
                lastScale = this.scale.clone();
                this.updateTransform();
                this.emitPropertyChanged("scale", this.scale);
            }
            // Check opacity
            if (this.opacity !== lastOpacity) {
                lastOpacity = this.opacity;
                this.updateMeshMaterials("opacity");
                this.emitPropertyChanged("opacity", this.opacity);
            }
            // Check visibility
            if (this.visible !== lastVisible) {
                lastVisible = this.visible;
                this.updateMeshVisibility();
                this.emitPropertyChanged("visible", this.visible);
            }
            // Continue checking periodically - use longer interval (250ms) to reduce overhead
            this._propertyWatcherTimer = setTimeout(checkForChanges, 250);
        };
        // Start the change detection loop
        this._propertyWatcherTimer = setTimeout(checkForChanges, 250);
    }
    /**
     * Get schematic dimensions (allocated space).
     * Returns [width, height, length] tuple.
     */
    getDimensions() {
        if (!this._cachedDimensions) {
            const dimensions = this.schematicWrapper.get_dimensions();
            this._cachedDimensions = [dimensions[0], dimensions[1], dimensions[2]];
        }
        return this._cachedDimensions;
    }
    /**
     * Get tight dimensions (actual block content, not pre-allocated space)
     * Returns [width, height, length] or [0, 0, 0] if no blocks exist
     */
    getTightDimensions() {
        const dimensions = this.schematicWrapper.get_tight_dimensions();
        return [dimensions[0], dimensions[1], dimensions[2]];
    }
    /**
     * Get tight bounding box min coordinates [x, y, z]
     * Returns null if no non-air blocks have been placed
     */
    getTightBoundsMin() {
        const min = this.schematicWrapper.get_tight_bounds_min();
        if (!min)
            return null;
        return [min[0], min[1], min[2]];
    }
    /**
     * Get tight bounding box max coordinates [x, y, z]
     * Returns null if no non-air blocks have been placed
     */
    getTightBoundsMax() {
        const max = this.schematicWrapper.get_tight_bounds_max();
        if (!max)
            return null;
        return [max[0], max[1], max[2]];
    }
    /**
     * Display detailed performance monitoring results
     */
    displayPerformanceResults(sessionData) {
        if (!sessionData) {
            console.warn("⚠️ displayPerformanceResults called with no data!");
            return;
        }
        // Debug log to check data presence
        // Aggregate metrics from chunk processing data
        let blockCount = 0;
        let meshCount = 0;
        if (sessionData.chunkProcessingData) {
            sessionData.chunkProcessingData.forEach((d) => {
                blockCount += d.blockCount || 0;
                meshCount += d.meshCount || 0;
            });
        }
        if (sessionData.breakdown && sessionData.breakdown.length > 0) {
            console.warn("📋 Detailed Breakdown:");
            sessionData.breakdown.forEach((op) => {
                console.warn(`  - ${op.operationId}: ${op.duration !== undefined ? op.duration.toFixed(2) : "0.00"}ms`);
            });
        }
        else {
            console.warn("⚠️ No breakdown data available.");
            if (sessionData.timingData) {
                console.log("Raw timing data:", JSON.stringify(sessionData.timingData));
            }
        }
    }
    emitPropertyChanged(property, value) {
        this.eventEmitter.emit("schematicPropertyChanged", {
            schematic: this,
            property,
            value,
        });
    }
    updateTransform() {
        this.group.position.copy(this.position);
        this.group.rotation.copy(this.rotation);
        this.group.scale.copy(this.scale);
    }
    syncTransformFromGroup() {
        this.position.copy(this.group.position);
        this.rotation.copy(this.group.rotation);
        this.scale.copy(this.group.scale);
        // Emit event
        this.emitPropertyChanged("transform", {
            position: this.position,
            rotation: this.rotation,
            scale: this.scale,
        });
    }
    applyPropertiesToObjects(objects) {
        // Determine if the SCHEMATIC ITSELF needs to be faded
        const schematicWantsFade = this.opacity < 1.0;
        objects.forEach((obj) => {
            obj.visible = this.visible;
            if (this.visible) {
                obj.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.frustumCulled = true;
                        const materials = Array.isArray(child.material) ? child.material : [child.material];
                        materials.forEach((mat) => {
                            if (mat) {
                                // If the schematic is being faded, apply its opacity.
                                // Otherwise, let the material keep its original opacity.
                                if (schematicWantsFade) {
                                    mat.opacity = this.opacity;
                                }
                                // CRITICAL FIX: Only set transparent = true if the schematic
                                // is being faded. NEVER set it to false, because that would
                                // override materials that are inherently transparent (like glass).
                                if (schematicWantsFade) {
                                    mat.transparent = true;
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    /**
     * Export the schematic using the new modular export system
     *
     * @param options Export options including format, quality, and callbacks
     * @returns Promise resolving to the export result
     *
     * @example
     * // Basic GLB export (recommended)
     * await schematic.export({ format: 'glb' });
     *
     * @example
     * // Export with options
     * await schematic.export({
     *   format: 'gltf',
     *   quality: 'high',
     *   normalMode: 'flip',
     *   filename: 'my_schematic',
     *   onProgress: (p) => console.log(`${p.progress * 100}%: ${p.message}`)
     * });
     */
    async export(options = {}) {
        // Wait for meshes to be ready
        await this.meshesReady;
        const exporter = new SchematicExporter();
        // Set up progress callback to use UI manager if available
        const originalProgress = options.onProgress;
        if (this.schematicRenderer.options.enableProgressBar && this.schematicRenderer.uiManager) {
            this.schematicRenderer.uiManager.showProgressBar(`Exporting ${this.name}`);
            exporter.on("exportProgress", (progress) => {
                this.schematicRenderer.uiManager?.updateProgress(progress.progress, progress.message);
                originalProgress?.(progress);
            });
            exporter.on("exportComplete", () => {
                setTimeout(() => {
                    this.schematicRenderer.uiManager?.hideProgressBar();
                }, 1000);
            });
            exporter.on("exportError", () => {
                this.schematicRenderer.uiManager?.hideProgressBar();
            });
        }
        // Merge default options
        const exportOptions = {
            filename: options.filename || `${this.name}_schematic`,
            format: options.format || "glb",
            quality: options.quality || "high",
            normalMode: options.normalMode || "double-sided", // Default to double-sided for max compatibility
            ...options,
        };
        try {
            const result = await exporter.export(this.group, exportOptions);
            // Auto-download if no onComplete callback is provided
            if (!options.onComplete) {
                exporter.download(result);
                // Clean up URL after a delay
                setTimeout(() => exporter.revokeUrl(result), 5000);
            }
            console.log(`Successfully exported schematic "${this.name}" as ${result.filename}`);
            return result;
        }
        catch (error) {
            console.error("Error exporting schematic:", error);
            throw error;
        }
    }
    /**
     * Export as GLB (binary GLTF) - recommended for most use cases
     * @param filename Optional filename (without extension)
     */
    async exportAsGLB(filename) {
        return this.export({
            format: "glb",
            filename: filename || this.name,
        });
    }
    /**
     * Exports the schematic as a GLTF file
     * @deprecated Use export() or exportAsGLB() instead for better normal handling
     * @param options Export options
     * @returns Promise that resolves when export is complete
     */
    async exportAsGLTF(options = {}) {
        // Map old API to new export system
        const format = options.binary ? "glb" : "gltf";
        await this.export({
            filename: options.filename || `${this.name}_schematic`,
            format,
            includeCustomExtensions: options.includeCustomExtensions,
            maxTextureSize: options.maxTextureSize,
            embedTextures: options.embedImages,
            animations: options.animations,
        });
    }
    async buildMeshes() {
        if (!this.visible) {
            return;
        }
        const { meshes, chunkMap } = await this.buildSchematicMeshes(this, this.chunkDimensions);
        this.chunkMeshes = chunkMap;
        // Apply properties to all objects
        this.applyPropertiesToObjects(meshes);
        // Add to group
        meshes.forEach((obj) => {
            this.group.add(obj);
        });
        this.updateTransform(); // This will apply position, rotation, and scale to the group
        this.group.visible = this.visible;
        this.meshes = meshes; // Keep for backward compatibility
        this.group.updateMatrixWorld(true);
        this.group.updateWorldMatrix(true, true);
        // Create initial visualizer for rendering bounds
        if (this.sceneManager.schematicRenderer.options.showRenderingBoundsHelper) {
            this.createRenderingBoundsHelper();
        }
        this.sceneManager.schematicRenderer.options.callbacks?.onSchematicRendered?.(this.name);
    }
    // Track chunk building progress
    reportBuildProgress(message, progress, totalChunks, completedChunks) {
        // Only show progress if enabled and UI manager exists
        if (this.schematicRenderer.options.enableProgressBar && this.schematicRenderer.uiManager) {
            // Format detailed progress message if chunks are provided
            let progressMessage = message;
            if (totalChunks !== undefined && completedChunks !== undefined) {
                progressMessage = `${message} (${completedChunks}/${totalChunks} chunks)`;
            }
            // Show progress bar if not already visible
            if (!this.schematicRenderer.uiManager.isProgressBarVisible()) {
                this.schematicRenderer.uiManager.showProgressBar("Building Schematic");
            }
            // Update progress
            this.schematicRenderer.uiManager.updateProgress(progress, progressMessage);
            // Hide when complete
            if (progress >= 1) {
                this.schematicRenderer.uiManager.hideProgressBar();
            }
        }
    }
    async buildSchematicMeshes(schematicObject, chunkDimensions = {
        chunkWidth: 16,
        chunkHeight: 16,
        chunkLength: 16,
    }, buildMode = this.schematicRenderer
        .options.meshBuildingMode || "incremental") {
        // Start performance monitoring session
        const sessionId = performanceMonitor.startSession(this.id, buildMode);
        if (this.schematicRenderer.renderManager?.renderer) {
            performanceMonitor.setRenderer(this.schematicRenderer.renderManager.renderer);
        }
        performanceMonitor.startOperation(`schematic-build-${buildMode}`, {
            schematicId: this.id,
            schematicName: this.name,
            buildMode: buildMode,
            chunkDimensions: chunkDimensions,
        });
        performanceMonitor.takeMemorySnapshot(`schematic-build-${buildMode}-start`);
        // Track initial memory state
        const initialMemory = performance.memory
            ? performance.memory.usedJSHeapSize
            : 0;
        try {
            let result;
            switch (buildMode) {
                case "immediate":
                    result = await this.buildSchematicMeshesImmediate(schematicObject, chunkDimensions);
                    break;
                case "incremental":
                    result = await this.buildSchematicMeshesIncremental(schematicObject, chunkDimensions);
                    break;
                case "instanced":
                    result = await this.buildSchematicMeshesInstanced(schematicObject);
                    break;
                case "batched":
                    // New high-performance batch mode - merges all chunks into a few meshes
                    result = await this.buildSchematicMeshesBatched(schematicObject, chunkDimensions);
                    break;
                default:
                    throw new Error(`Invalid build mode: ${buildMode}. Use 'immediate', 'incremental', 'instanced', or 'batched'.`);
            }
            // Track final memory state and record detailed metrics
            const finalMemory = performance.memory
                ? performance.memory.usedJSHeapSize
                : 0;
            const memoryDelta = finalMemory - initialMemory;
            // Record detailed chunk processing data
            performanceMonitor.recordChunkProcessing({
                chunkId: `${this.id}-complete`,
                chunkCoords: [0, 0, 0],
                processingTime: performance.now() - performanceMonitor.getCurrentOperationStartTime?.() || 0,
                blockCount: result.meshes.length,
                meshCount: result.meshes.length,
                memoryUsed: memoryDelta,
                totalVertices: result.meshes.length * 100, // Estimate
                totalIndices: result.meshes.length * 150, // Estimate
                materialGroups: result.meshes.length,
                blockTypes: ["schematic-complete"], // Summary
                renderingPhases: [],
                blockTypeTimings: new Map(),
                geometryStats: {
                    facesCulled: 0,
                    facesGenerated: result.meshes.length,
                    cullingEfficiency: 0,
                    averageVerticesPerBlock: 100,
                    textureAtlasUsage: [],
                },
                memoryBreakdown: {
                    vertexBuffers: memoryDelta * 0.4,
                    indexBuffers: memoryDelta * 0.3,
                    materials: memoryDelta * 0.1,
                    textures: memoryDelta * 0.1,
                    other: memoryDelta * 0.1,
                },
            });
            performanceMonitor.takeMemorySnapshot(`schematic-build-${buildMode}-end`);
            // Ensure main operation is closed BEFORE ending session
            performanceMonitor.endOperation(`schematic-build-${buildMode}`);
            // End performance monitoring session and display results
            const sessionData = performanceMonitor.endSession(sessionId);
            if (sessionData) {
                this.displayPerformanceResults(sessionData);
                // Dispatch event for UI components to react
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("schematicRenderComplete", {
                        detail: sessionData,
                    }));
                }
            }
            return result;
        }
        catch (error) {
            performanceMonitor.endOperation(`schematic-build-${buildMode}`); // Ensure closed on error too
            throw error;
        }
    }
    // TRUE lazy loading - minimal memory footprint
    async buildSchematicMeshesImmediate(schematicObject, chunkDimensions = {
        chunkWidth: 16,
        chunkHeight: 16,
        chunkLength: 16,
    }) {
        const overallStartTime = performance.now();
        const schematic = schematicObject.schematicWrapper;
        // STEP 1: Initialize pipeline
        this.reportBuildProgress("Initializing pipeline...", 0.05);
        const palettes = this.getPalettes(schematic);
        performanceMonitor.startOperation("Palette Precomputation");
        await this.worldMeshBuilder.precomputePaletteGeometries(palettes.default);
        performanceMonitor.endOperation("Palette Precomputation");
        this.reportBuildProgress("Creating chunk iterator...", 0.1);
        performanceMonitor.startOperation("Chunk Iterator Creation");
        const iterator = schematic.create_lazy_chunk_iterator(chunkDimensions.chunkWidth, chunkDimensions.chunkHeight, chunkDimensions.chunkLength, "bottom_up", 0, 0, 0);
        performanceMonitor.endOperation("Chunk Iterator Creation");
        const totalChunks = iterator.total_chunks();
        if (totalChunks === 0) {
            this.reportBuildProgress("Schematic build complete (no chunks)", 1.0, 0, 0);
            return { meshes: [], chunkMap: new Map() };
        }
        const chunkMap = new Map();
        const renderingBounds = schematicObject.renderingBounds?.enabled
            ? schematicObject.renderingBounds
            : undefined;
        let processedChunkCount = 0;
        let totalMeshCount = 0;
        const progressUpdateInterval = Math.max(1, Math.floor(totalChunks / 20));
        this.reportBuildProgress("Processing chunks with minimal memory...", 0.15, totalChunks, 0);
        performanceMonitor.startOperation("Process All Chunks");
        // Parallel Processing Logic
        const CONCURRENCY_LIMIT = navigator.hardwareConcurrency || 4;
        const activePromises = [];
        // Helper to dispatch a chunk task
        const processChunk = async (chunkData) => {
            const { chunk_x, chunk_y, chunk_z, blocks } = chunkData;
            // Bounds culling
            if (renderingBounds?.enabled) {
                const chunkMinX = chunk_x * chunkDimensions.chunkWidth;
                const chunkMinY = chunk_y * chunkDimensions.chunkHeight;
                const chunkMinZ = chunk_z * chunkDimensions.chunkLength;
                const chunkMaxX = chunkMinX + chunkDimensions.chunkWidth;
                const chunkMaxY = chunkMinY + chunkDimensions.chunkHeight;
                const chunkMaxZ = chunkMinZ + chunkDimensions.chunkLength;
                if (chunkMaxX < renderingBounds.min.x ||
                    chunkMinX > renderingBounds.max.x ||
                    chunkMaxY < renderingBounds.min.y ||
                    chunkMinY > renderingBounds.max.y ||
                    chunkMaxZ < renderingBounds.min.z ||
                    chunkMinZ > renderingBounds.max.z) {
                    processedChunkCount++;
                    if (processedChunkCount % progressUpdateInterval === 0) {
                        this.reportBuildProgress("Processing chunks (bounds culled)...", 0.15 + (processedChunkCount / totalChunks) * 0.8, totalChunks, processedChunkCount);
                    }
                    return;
                }
            }
            // Process chunk
            const chunkMeshes = await this.worldMeshBuilder.getChunkMesh({
                blocks: blocks,
                chunk_x,
                chunk_y,
                chunk_z,
            }, schematicObject, renderingBounds);
            processedChunkCount++;
            if (chunkMeshes && chunkMeshes.length > 0) {
                // Store chunk reference for management
                const chunkKey = `${chunk_x},${chunk_y},${chunk_z}`;
                chunkMap.set(chunkKey, chunkMeshes);
                // Apply properties and add to scene
                this.applyPropertiesToObjects(chunkMeshes);
                chunkMeshes.forEach((mesh) => {
                    this.group.add(mesh);
                });
                totalMeshCount += chunkMeshes.length;
            }
            // Update progress occasionally
            if (processedChunkCount % progressUpdateInterval === 0) {
                this.reportBuildProgress("Processing chunks...", 0.15 + (processedChunkCount / totalChunks) * 0.8, totalChunks, processedChunkCount);
            }
        };
        // Iterate and dispatch tasks
        while (iterator.has_next()) {
            const chunkData = iterator.next();
            if (!chunkData)
                break;
            // Wait if concurrency limit reached
            if (activePromises.length >= CONCURRENCY_LIMIT) {
                await Promise.race(activePromises);
            }
            // Start new task
            const promise = processChunk(chunkData).then(() => {
                // Remove self from active promises
                const idx = activePromises.indexOf(promise);
                if (idx > -1)
                    activePromises.splice(idx, 1);
            });
            activePromises.push(promise);
        }
        // Wait for remaining tasks
        await Promise.all(activePromises);
        performanceMonitor.endOperation("Process All Chunks");
        this.reportBuildProgress("Finalizing scene...", 0.95, totalChunks, processedChunkCount);
        this.group.updateMatrixWorld(true);
        const totalTime = performance.now() - overallStartTime;
        // Return meshes from scene graph (not from accumulator!)
        const finalMeshes = Array.from(this.group.children);
        // Dispatch completion event
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("schematicRenderComplete", {
                detail: {
                    schematicId: this.id,
                    schematicName: this.name,
                    totalChunks: totalChunks,
                    processedChunks: processedChunkCount,
                    buildTimeMs: totalTime,
                    meshCount: totalMeshCount,
                    optimized: true,
                    immediate: true,
                    trueLazy: true, // Flag for true lazy loading
                },
            }));
        }
        // Log final stats
        const renderer = this.schematicRenderer.renderManager?.renderer;
        if (renderer && renderer.info) {
            console.log(`FINAL TRUE LAZY STATS - Draw Calls: ${renderer.info.render.calls}, Tris: ${renderer.info.render.triangles}`);
            console.log(`Memory - Geometries: ${renderer.info.memory.geometries}, Textures: ${renderer.info.memory.textures}`);
        }
        const paletteStats = this.worldMeshBuilder.getPaletteStats();
        console.log(`Palette Cache - ${paletteStats.paletteSize} block types, ${(paletteStats.memoryEstimate /
            1024 /
            1024).toFixed(1)}MB`);
        this.reportBuildProgress("TRUE lazy build complete", 1.0, totalChunks, processedChunkCount);
        setTimeout(() => {
            if (this.schematicRenderer.uiManager) {
                this.schematicRenderer.uiManager.hideProgressBar();
            }
        }, 500);
        return { meshes: finalMeshes, chunkMap };
    }
    // Also fix the incremental version
    async buildSchematicMeshesIncremental(schematicObject, chunkDimensions = {
        chunkWidth: 16,
        chunkHeight: 16,
        chunkLength: 16,
    }) {
        const overallStartTime = performance.now();
        const renderer = this.schematicRenderer.renderManager?.renderer;
        const schematic = schematicObject.schematicWrapper;
        // Initialize pipeline
        const palettes = this.getPalettes(schematic);
        await this.worldMeshBuilder.precomputePaletteGeometries(palettes.default);
        // CRITICAL: Wait for JSZip's async postMessage queue to drain
        // JSZip uses setImmediate (via postMessage) which continues after await returns
        await new Promise((resolve) => setTimeout(resolve, 100));
        const iterator = schematic.create_lazy_chunk_iterator(chunkDimensions.chunkWidth, chunkDimensions.chunkHeight, chunkDimensions.chunkLength, "bottom_up", 0, 0, 0);
        const totalChunks = iterator.total_chunks();
        if (totalChunks === 0) {
            this.reportBuildProgress("Schematic build complete (no chunks)", 1.0, 0, 0);
            return { meshes: [], chunkMap: new Map() };
        }
        const chunkMap = new Map();
        let totalMeshCount = 0;
        this.reportBuildProgress("Processing optimized chunks...", 0, totalChunks, 0);
        const renderingBounds = schematicObject.renderingBounds?.enabled
            ? schematicObject.renderingBounds
            : undefined;
        let processedChunkCount = 0;
        performanceMonitor.startOperation("schematic-build-incremental");
        performanceMonitor.startOperation("Process All Chunks");
        return new Promise(async (resolvePromise, rejectPromise) => {
            try {
                // PERFORMANCE FIX: Batch all worker calls to avoid per-await event loop overhead
                // Collect all chunk data first
                const allChunks = [];
                while (iterator.has_next()) {
                    const chunkData = iterator.next();
                    if (!chunkData)
                        break;
                    const { chunk_x, chunk_y, chunk_z, blocks } = chunkData;
                    // Bounds culling
                    if (renderingBounds?.enabled) {
                        const chunkMinX = chunk_x * chunkDimensions.chunkWidth;
                        const chunkMinY = chunk_y * chunkDimensions.chunkHeight;
                        const chunkMinZ = chunk_z * chunkDimensions.chunkLength;
                        const chunkMaxX = chunkMinX + chunkDimensions.chunkWidth;
                        const chunkMaxY = chunkMinY + chunkDimensions.chunkHeight;
                        const chunkMaxZ = chunkMinZ + chunkDimensions.chunkLength;
                        if (chunkMaxX < renderingBounds.min.x ||
                            chunkMinX > renderingBounds.max.x ||
                            chunkMaxY < renderingBounds.min.y ||
                            chunkMinY > renderingBounds.max.y ||
                            chunkMaxZ < renderingBounds.min.z ||
                            chunkMinZ > renderingBounds.max.z) {
                            continue; // Skip culled chunks
                        }
                    }
                    allChunks.push({ chunk_x, chunk_y, chunk_z, blocks });
                }
                // Process in batches to avoid overwhelming the worker pool
                const BATCH_SIZE = 8; // Match worker count
                const totalChunksToProcess = allChunks.length;
                for (let batchStart = 0; batchStart < totalChunksToProcess; batchStart += BATCH_SIZE) {
                    const batchEnd = Math.min(batchStart + BATCH_SIZE, totalChunksToProcess);
                    const batch = allChunks.slice(batchStart, batchEnd);
                    // Send all chunks in this batch to workers simultaneously
                    const batchPromises = batch.map(({ chunk_x, chunk_y, chunk_z, blocks }) => this.worldMeshBuilder
                        .getChunkMesh({ blocks, chunk_x, chunk_y, chunk_z }, schematicObject, renderingBounds)
                        .then((meshes) => ({ chunk_x, chunk_y, chunk_z, meshes })));
                    // Await entire batch at once - single yield point!
                    const batchResults = await Promise.all(batchPromises);
                    // Add all batch results to scene
                    for (const { chunk_x, chunk_y, chunk_z, meshes } of batchResults) {
                        processedChunkCount++;
                        if (meshes && meshes.length > 0) {
                            const chunkKey = `${chunk_x},${chunk_y},${chunk_z}`;
                            chunkMap.set(chunkKey, meshes);
                            this.applyPropertiesToObjects(meshes);
                            meshes.forEach((mesh) => this.group.add(mesh));
                            totalMeshCount += meshes.length;
                        }
                    }
                    // Log progress every batch
                    console.log(`[SceneAdd] batch=${Math.floor(batchStart / BATCH_SIZE) + 1} processed=${processedChunkCount}/${totalChunksToProcess} children=${this.group.children.length}`);
                    this.reportBuildProgress("Processing chunks...", processedChunkCount / totalChunksToProcess, totalChunksToProcess, processedChunkCount);
                }
                // Final render
                if (this.schematicRenderer.renderManager && renderer) {
                    const renderStartTime = performance.now();
                    this.schematicRenderer.renderManager.render();
                    const renderTime = performance.now() - renderStartTime;
                    console.log(`[RenderTiming] FINAL meshes=${this.group.children.length} renderMs=${renderTime.toFixed(0)}`);
                }
                // Complete
                performanceMonitor.endOperation("Process All Chunks");
                this.group.updateMatrixWorld(true);
                const finalMeshes = Array.from(this.group.children);
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("schematicRenderComplete", {
                        detail: {
                            schematicId: this.id,
                            schematicName: this.name,
                            totalChunks: totalChunks,
                            processedChunks: processedChunkCount,
                            buildTimeMs: performance.now() - overallStartTime,
                            meshCount: totalMeshCount,
                            optimized: true,
                            incremental: true,
                            batchedWorkers: true,
                        },
                    }));
                }
                this.reportBuildProgress("Build complete", 1.0, totalChunks, processedChunkCount);
                performanceMonitor.endOperation("schematic-build-incremental");
                setTimeout(() => {
                    if (this.schematicRenderer.uiManager) {
                        this.schematicRenderer.uiManager.hideProgressBar();
                    }
                }, 800);
                resolvePromise({ meshes: finalMeshes, chunkMap });
            }
            catch (error) {
                performanceMonitor.endOperation("Process All Chunks");
                performanceMonitor.endOperation("schematic-build-incremental");
                console.error(`[SchematicObject] Error during batched processing:`, error);
                rejectPromise(error);
            }
        });
    }
    /**
     * High-performance batched build mode
     *
     * Processes all chunks through a single worker that accumulates geometry,
     * then returns just a few merged meshes (one per category: solid, transparent, etc.)
     *
     * Benefits:
     * - Creates only 2-3 THREE.Mesh objects instead of hundreds
     * - Drastically reduces main thread work
     * - Best for large schematics where mesh count is the bottleneck
     */
    async buildSchematicMeshesBatched(schematicObject, chunkDimensions = {
        chunkWidth: 16,
        chunkHeight: 16,
        chunkLength: 16,
    }) {
        const overallStartTime = performance.now();
        const schematic = schematicObject.schematicWrapper;
        // STEP 1: Initialize pipeline
        this.reportBuildProgress("Initializing batched pipeline...", 0.05);
        const palettes = this.getPalettes(schematic);
        performanceMonitor.startOperation("Palette Precomputation");
        await this.worldMeshBuilder.precomputePaletteGeometries(palettes.default);
        performanceMonitor.endOperation("Palette Precomputation");
        // STEP 2: Create chunk iterator
        this.reportBuildProgress("Creating chunk iterator...", 0.1);
        performanceMonitor.startOperation("Chunk Iterator Creation");
        const iterator = schematic.create_lazy_chunk_iterator(chunkDimensions.chunkWidth, chunkDimensions.chunkHeight, chunkDimensions.chunkLength, "bottom_up", 0, 0, 0);
        performanceMonitor.endOperation("Chunk Iterator Creation");
        const totalChunks = iterator.total_chunks();
        if (totalChunks === 0) {
            this.reportBuildProgress("Schematic build complete (no chunks)", 1.0, 0, 0);
            return { meshes: [], chunkMap: new Map() };
        }
        // STEP 3: Collect all chunk data
        this.reportBuildProgress("Collecting chunk data...", 0.15, totalChunks, 0);
        const allChunks = [];
        while (iterator.has_next()) {
            const chunkData = iterator.next();
            if (!chunkData || chunkData.blocks.length === 0)
                continue;
            // Convert blocks to Int32Array
            const blocks = chunkData.blocks;
            let blocksArray;
            if (blocks instanceof Int32Array) {
                blocksArray = blocks;
            }
            else {
                blocksArray = new Int32Array(blocks.length * 4);
                for (let i = 0; i < blocks.length; i++) {
                    const block = blocks[i];
                    blocksArray[i * 4] = block[0];
                    blocksArray[i * 4 + 1] = block[1];
                    blocksArray[i * 4 + 2] = block[2];
                    blocksArray[i * 4 + 3] = block[3];
                }
            }
            allChunks.push({
                blocks: blocksArray,
                chunk_x: chunkData.chunk_x,
                chunk_y: chunkData.chunk_y,
                chunk_z: chunkData.chunk_z,
            });
        }
        // STEP 4: Process all chunks in batch mode
        this.reportBuildProgress("Processing chunks in BATCH mode...", 0.2, totalChunks, 0);
        performanceMonitor.startOperation("Process All Chunks");
        let processedCount = 0;
        const batchedMeshes = await this.worldMeshBuilder.processChunksBatched(allChunks, (processed, total) => {
            processedCount = processed;
            const progress = 0.2 + (processed / total) * 0.7;
            this.reportBuildProgress(`Batch processing chunks...`, progress, total, processed);
        });
        performanceMonitor.endOperation("Process All Chunks");
        // STEP 5: Add meshes to scene
        this.reportBuildProgress("Adding batched meshes to scene...", 0.95, totalChunks, processedCount);
        // Add meshes progressively to avoid GPU upload freeze
        // Each mesh addition triggers GPU buffer upload, so we spread them out
        const MESHES_PER_FRAME = 2; // Add 2 meshes per frame
        for (let i = 0; i < batchedMeshes.length; i += MESHES_PER_FRAME) {
            const batch = batchedMeshes.slice(i, i + MESHES_PER_FRAME);
            for (const mesh of batch) {
                this.group.add(mesh);
            }
            // Force GPU upload by rendering, then yield
            if (this.schematicRenderer.renderManager) {
                this.schematicRenderer.renderManager.render();
            }
            // Let browser breathe - use RAF for real frame timing
            if (i + MESHES_PER_FRAME < batchedMeshes.length) {
                await new Promise((r) => requestAnimationFrame(() => r()));
            }
        }
        this.group.updateMatrixWorld(true);
        const totalTime = performance.now() - overallStartTime;
        this.reportBuildProgress("Build complete!", 1.0, totalChunks, processedCount);
        // Dispatch completion event
        if (typeof window !== "undefined") {
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("schematicRenderComplete", {
                    detail: {
                        schematicId: this.id,
                        schematicName: this.name,
                        totalChunks,
                        processedChunks: processedCount,
                        buildTimeMs: totalTime,
                        meshCount: batchedMeshes.length,
                        optimized: true,
                        batched: true,
                    },
                }));
            }, 100);
        }
        return {
            meshes: batchedMeshes,
            chunkMap: new Map([["batched", batchedMeshes]]),
        };
    }
    async buildSchematicMeshesInstanced(schematicObject) {
        const overallStartTime = performance.now();
        // Initialize instanced rendering
        await this.worldMeshBuilder.precomputePaletteGeometries(this.getPalettes(this.schematicWrapper).default);
        this.worldMeshBuilder.enableInstancedRendering(this.group, true);
        // Render entire schematic using instanced rendering
        await this.worldMeshBuilder.renderSchematicInstanced(schematicObject);
        const totalTime = performance.now() - overallStartTime;
        // Return instanced meshes from scene graph
        const instancedMeshes = Array.from(this.group.children);
        // Dispatch completion event
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("schematicRenderComplete", {
                detail: {
                    schematicId: this.id,
                    schematicName: this.name,
                    buildTimeMs: totalTime,
                    meshCount: instancedMeshes.length,
                    optimized: true,
                    instanced: true, // Flag for instanced rendering
                },
            }));
        }
        return { meshes: instancedMeshes, chunkMap: new Map() };
    }
    /**
     * Creates or updates the rendering bounds helper visualization
     */
    createRenderingBoundsHelper(visible = true) {
        // Update the visualizer if it exists
        if (this.renderingBounds.helper) {
            this.group.remove(this.renderingBounds.helper);
        }
        if (visible && this.renderingBounds.enabled) {
            // Create a box to represent the rendering bounds
            const box = new THREE.Box3(this.renderingBounds.min.clone().add(new THREE.Vector3(-0.5, -0.5, -0.5)), this.renderingBounds.max.clone().add(new THREE.Vector3(-0.5, -0.5, -0.5)));
            // Create a box helper to visualize the bounds
            const helper = new THREE.Box3Helper(box, new THREE.Color(0x00ff00));
            this.renderingBounds.helper = helper;
            this.group.add(helper);
        }
        else {
            this.renderingBounds.helper = undefined;
        }
    }
    /**
     * Sets the rendering bounds for this schematic
     * @param min Minimum coordinates for rendering
     * @param max Maximum coordinates for rendering
     * @param showHelper Whether to show a visual helper for the bounds
     */
    setRenderingBounds(min, max, showHelper = true) {
        // Convert arrays to Vector3 if needed
        if (Array.isArray(min)) {
            min = new THREE.Vector3(min[0], min[1], min[2]);
        }
        if (Array.isArray(max)) {
            max = new THREE.Vector3(max[0], max[1], max[2]);
        }
        // Update the rendering bounds
        this.renderingBounds.min = min.clone();
        this.renderingBounds.max = max.clone();
        // Create/update the visualizer if requested
        this.createRenderingBoundsHelper(showHelper);
        // Rebuild mesh to apply the rendering bounds
        this.rebuildMesh();
    }
    /**
     * Updates rendering bounds without triggering rebuild - just emits change event
     */
    updateRenderingBounds() {
        // Just emit change event, don't rebuild automatically
        this.emitPropertyChanged("renderingBounds", {
            min: this.renderingBounds.min.toArray(),
            max: this.renderingBounds.max.toArray(),
            enabled: this.renderingBounds.enabled,
        });
    }
    /**
     * Shows or hides the rendering bounds helper
     * @param visible Whether the helper should be visible
     */
    showRenderingBoundsHelper(visible) {
        this.createRenderingBoundsHelper(visible);
    }
    /**
     * Resets the rendering bounds to include the full schematic
     */
    resetRenderingBounds() {
        const dimensions = this.getDimensions();
        this.setRenderingBounds(new THREE.Vector3(0, 0, 0), new THREE.Vector3(dimensions[0], dimensions[1], dimensions[2]));
    }
    async getMeshes() {
        await this.meshesReady;
        return Array.from(this.group.children);
    }
    // Update chunk management methods to handle Object3D
    getChunkObjectsAt(chunkX, chunkY, chunkZ) {
        const key = `${chunkX},${chunkY},${chunkZ}`;
        return this.chunkMeshes.get(key) || null;
    }
    setChunkObjectsAt(chunkX, chunkY, chunkZ, objects) {
        const key = `${chunkX},${chunkY},${chunkZ}`;
        this.chunkMeshes.set(key, objects);
    }
    // Keep the old method names for backward compatibility
    getChunkMeshAt(chunkX, chunkY, chunkZ) {
        return this.getChunkObjectsAt(chunkX, chunkY, chunkZ);
    }
    setChunkMeshAt(chunkX, chunkY, chunkZ, meshes) {
        this.setChunkObjectsAt(chunkX, chunkY, chunkZ, meshes);
    }
    // Optimized material update method
    updateMeshMaterials(property) {
        const needsTransparency = this.opacity < 1.0;
        this.group.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((mat) => {
                    if (mat) {
                        mat.opacity = this.opacity;
                        mat.transparent = needsTransparency;
                    }
                });
            }
        });
        // Emit event if necessary
        this.emitPropertyChanged("material", { property, value: this.opacity });
    }
    updateMeshVisibility() {
        this.group.visible = this.visible;
        // Emit event if necessary
        this.emitPropertyChanged("visibility", this.visible);
    }
    async updateMesh() {
        // Remove old meshes from the scene
        this.meshes.forEach((mesh) => {
            this.group.remove(mesh);
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((material) => material.dispose());
            }
            else {
                mesh.material.dispose();
            }
        });
        // Clear chunk meshes
        this.chunkMeshes.clear();
        if (this.visible) {
            await this.buildMeshes();
        }
    }
    async rebuildMesh() {
        performanceMonitor.startOperation(`rebuildMesh-${this.name}`);
        // Show progress bar if enabled in renderer options
        const renderer = this.sceneManager?.schematicRenderer;
        if (renderer?.options.enableProgressBar && renderer.uiManager) {
            renderer.uiManager.showProgressBar(`Rebuilding ${this.name}`);
            renderer.uiManager.updateProgress(0.1, "Disposing old meshes...");
        }
        // Remove old meshes from the scene
        this.meshes.forEach((mesh) => {
            this.group.remove(mesh);
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((material) => material?.dispose());
            }
            else {
                mesh.material?.dispose();
            }
        });
        // Also clear ALL children from the group, EXCEPT regions
        // Create a copy of children to iterate over safely
        const children = [...this.group.children];
        let removedCount = 0;
        for (const child of children) {
            // Skip regions - regions are parented to the schematic group and have names starting with "region_"
            // We check 'name' because 'id' is an internal three.js integer
            if (child.name && child.name.startsWith("region_")) {
                continue;
            }
            this.group.remove(child);
            removedCount++;
            if (child instanceof THREE.Mesh) {
                child.geometry?.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach((m) => m?.dispose());
                }
                else {
                    child.material?.dispose();
                }
            }
        }
        // Clear chunk meshes and update progress
        this.chunkMeshes.clear();
        this.meshes = [];
        if (renderer?.options.enableProgressBar && renderer.uiManager) {
            renderer.uiManager.updateProgress(0.2, "Building new meshes...");
        }
        // Build new meshes if visible
        if (this.visible) {
            await this.buildMeshes();
        }
        // Hide progress bar when complete
        if (renderer?.options.enableProgressBar && renderer.uiManager) {
            renderer.uiManager.hideProgressBar();
        }
        performanceMonitor.endOperation(`rebuildMesh-${this.name}`);
    }
    getSchematicWrapper() {
        return this.schematicWrapper;
    }
    getRegions() {
        return this.schematicRenderer.regionManager?.getRegionsForSchematic(this.id) || [];
    }
    getRegion(name) {
        // First try scoped name
        const scopedName = `${this.id}_${name}`;
        const region = this.schematicRenderer.regionManager?.getRegion(scopedName);
        if (region)
            return region;
        // Fallback to raw name if user created it manually without scoping
        return this.schematicRenderer.regionManager?.getRegion(name);
    }
    createRegion(name, min, maxOrOptions, options) {
        const scopedName = `${this.id}_${name}`;
        let max;
        let finalOptions = options;
        // Check if 3rd argument (maxOrOptions) is a point (has x, y, z)
        if (maxOrOptions &&
            typeof maxOrOptions === "object" &&
            "x" in maxOrOptions &&
            "y" in maxOrOptions &&
            "z" in maxOrOptions) {
            max = maxOrOptions;
        }
        else {
            // It's options or undefined, so default max to min (single block region)
            max = min;
            // If it's defined (options), use it as options
            if (maxOrOptions) {
                finalOptions = maxOrOptions;
            }
        }
        return this.schematicRenderer.regionManager.createRegion(scopedName, min, max, this.id, finalOptions);
    }
    /**
     * Whether definition regions from schematic metadata are currently visible
     */
    get definitionRegionsVisible() {
        return this._definitionRegionsVisible;
    }
    /**
     * Load definition regions from this schematic's metadata.
     * Definition regions are stored in NucleationDefinitions metadata,
     * typically created via CircuitBuilder, Insign, or direct API calls.
     *
     * @param autoShow - Whether to immediately show the regions (default: true based on renderer options)
     * @returns Array of created region names
     */
    loadDefinitionRegions(autoShow) {
        if (!this.schematicRenderer.regionManager) {
            console.warn("[SchematicObject] RegionManager not available, cannot load definition regions.");
            return [];
        }
        const shouldShow = autoShow ?? this.schematicRenderer.options.definitionRegionOptions?.showOnLoad ?? true;
        const regionNames = this.schematicRenderer.regionManager.loadDefinitionRegionsFromSchematic(this.id, shouldShow);
        this._definitionRegionsVisible = shouldShow && regionNames.length > 0;
        return regionNames;
    }
    /**
     * Show all definition regions for this schematic
     */
    showDefinitionRegions() {
        this.schematicRenderer.regionManager?.showDefinitionRegions(this.id);
        this._definitionRegionsVisible = true;
    }
    /**
     * Hide all definition regions for this schematic
     */
    hideDefinitionRegions() {
        this.schematicRenderer.regionManager?.hideDefinitionRegions(this.id);
        this._definitionRegionsVisible = false;
    }
    /**
     * Toggle visibility of all definition regions for this schematic
     * @returns The new visibility state
     */
    toggleDefinitionRegions() {
        const isVisible = this.schematicRenderer.regionManager?.toggleDefinitionRegions(this.id) ?? false;
        this._definitionRegionsVisible = isVisible;
        return isVisible;
    }
    /**
     * Check if this schematic has any definition regions loaded
     */
    hasDefinitionRegions() {
        return this.schematicRenderer.regionManager?.hasDefinitionRegions(this.id) ?? false;
    }
    /**
     * Get the names of all definition regions for this schematic
     */
    getDefinitionRegionNames() {
        // First get regions from schematic wrapper metadata
        const metadataRegions = this.schematicWrapper.getDefinitionRegionNames();
        return Array.from(metadataRegions);
    }
    /**
     * Get a definition region by its original name (from schematic metadata).
     * Returns the EditableRegionHighlight if loaded, or undefined.
     */
    getDefinitionRegion(name) {
        const scopedName = `${this.id}_defRegion_${name}`;
        return this.schematicRenderer.regionManager?.getRegion(scopedName);
    }
    /**
     * Remove all loaded definition regions for this schematic
     */
    removeDefinitionRegions() {
        this.schematicRenderer.regionManager?.removeDefinitionRegions(this.id);
        this._definitionRegionsVisible = false;
    }
    /**
     * Creates a callable JavaScript function from this schematic using region-based IO.
     * This allows you to treat the schematic as a black-box function in JS.
     *
     * @param inputs List of input definitions
     * @param outputs List of output definitions
     * @returns A callable object to run the circuit
     */
    createCircuitFunction(inputs, outputs) {
        // Dynamic import to avoid circular dependencies if any, and access the exported builders
        // We use the schematicWrapper instance we already have
        // 1. Build the Circuit using CircuitBuilderWrapper
        // This uses the new high-level API which handles layout building and executor creation
        let builder = new CircuitBuilderWrapper(this.schematicWrapper);
        // Helper to resolve region
        const resolveRegion = (region, filters) => {
            let defRegion;
            if (region instanceof DefinitionRegionWrapper) {
                defRegion = region;
            }
            else if (typeof region === "string") {
                // Try using getRegion to handle scoping automatically
                const regionObj = this.getRegion(region);
                if (!regionObj) {
                    throw new Error(`Region '${region}' not found in RegionManager`);
                }
                // Use the region's native conversion method, passing the schematic for filtering
                defRegion = regionObj.toDefinitionRegion(this.schematicWrapper);
            }
            else {
                // It's a simple bounds object
                defRegion = DefinitionRegionWrapper.fromBounds(new BlockPosition(region.min.x, region.min.y, region.min.z), new BlockPosition(region.max.x, region.max.y, region.max.z));
            }
            // Apply additional filters from arguments if provided
            // Note: If the region itself already applied filters (in toDefinitionRegion),
            // these will be applied ON TOP (intersection or union depending on intent, here usually filtering further)
            // But actually, toDefinitionRegion returns the filtered points.
            // filterByBlock returns a subset. So applying another filterByBlock intersects.
            // However, the previous logic was: if filters provided, filter the box.
            // Now: if region has internal filters, it returns filtered points.
            // If we also provide filters here, we probably want to apply them too.
            if (filters) {
                const filterList = Array.isArray(filters) ? filters : [filters];
                if (filterList.length > 0) {
                    // Apply first filter
                    const filteredRegion = defRegion.filterByBlock(this.schematicWrapper, filterList[0]);
                    // Apply subsequent filters and union results (OR logic)
                    for (let i = 1; i < filterList.length; i++) {
                        const nextFiltered = defRegion.filterByBlock(this.schematicWrapper, filterList[i]);
                        filteredRegion.unionInto(nextFiltered);
                        nextFiltered.free();
                    }
                    // If defRegion was created locally or returned new from toDefinitionRegion, we should free it
                    if (!(region instanceof DefinitionRegionWrapper)) {
                        defRegion.free();
                    }
                    defRegion = filteredRegion;
                }
            }
            return defRegion;
        };
        // Helper to resolve sort strategy
        const resolveSort = (sort) => {
            if (!sort)
                return undefined;
            if (sort instanceof SortStrategyWrapper)
                return sort;
            if (typeof sort === "string") {
                return SortStrategyWrapper.fromString(sort);
            }
            return undefined;
        };
        // Add Inputs
        for (const input of inputs) {
            // If using signal mode (packed4), force bits to be at least 4 to match layout expectations
            const effectiveBits = input.mode === "signal" && input.bits < 4 ? 4 : input.bits;
            const type = input.signed
                ? IoTypeWrapper.signedInt(effectiveBits)
                : IoTypeWrapper.unsignedInt(effectiveBits);
            const region = resolveRegion(input.region, input.blockFilter);
            const sortStrategy = resolveSort(input.sort);
            if (input.mode === "signal") {
                const layout = LayoutFunctionWrapper.packed4();
                if (sortStrategy) {
                    builder = builder.withInputSorted(input.name, type, layout, region, sortStrategy);
                }
                else {
                    builder = builder.withInput(input.name, type, layout, region);
                }
            }
            else {
                // Use Auto for default/binary mode
                if (sortStrategy) {
                    builder = builder.withInputAutoSorted(input.name, type, region, sortStrategy);
                }
                else {
                    builder = builder.withInputAuto(input.name, type, region);
                }
            }
        }
        // Add Outputs
        for (const output of outputs) {
            // If using signal mode (packed4), force bits to be at least 4 to match layout expectations
            const effectiveBits = output.mode === "signal" && output.bits < 4 ? 4 : output.bits;
            const type = output.signed
                ? IoTypeWrapper.signedInt(effectiveBits)
                : IoTypeWrapper.unsignedInt(effectiveBits);
            const region = resolveRegion(output.region, output.blockFilter);
            const sortStrategy = resolveSort(output.sort);
            if (output.mode === "signal") {
                const layout = LayoutFunctionWrapper.packed4();
                if (sortStrategy) {
                    builder = builder.withOutputSorted(output.name, type, layout, region, sortStrategy);
                }
                else {
                    builder = builder.withOutput(output.name, type, layout, region);
                }
            }
            else {
                // Use Auto for default/binary mode
                if (sortStrategy) {
                    builder = builder.withOutputAutoSorted(output.name, type, region, sortStrategy);
                }
                else {
                    builder = builder.withOutputAuto(output.name, type, region);
                }
            }
        }
        // Build directly to executor
        const executor = builder.build();
        // 4. Return the Interface
        return {
            run: (inputValues, maxTicks = 1000, mode = "stable") => {
                // Sanitize inputs: Convert booleans to numbers (1/0)
                const sanitizedInputs = {};
                for (const [key, val] of Object.entries(inputValues)) {
                    sanitizedInputs[key] = typeof val === "boolean" ? (val ? 1 : 0) : val;
                }
                let executionMode;
                if (mode === "fixed") {
                    executionMode = ExecutionModeWrapper.fixedTicks(maxTicks);
                }
                else {
                    executionMode = ExecutionModeWrapper.untilStable(2, maxTicks);
                }
                const result = executor.execute(sanitizedInputs, executionMode);
                return result;
            },
            reset: () => executor.reset(),
            sync: async () => {
                const updatedSchematic = executor.syncToSchematic();
                // Update the wrapper reference to the new state
                this.schematicWrapper = updatedSchematic;
                // Rebuild visuals
                await this.rebuildMesh();
                // Return the current outputs for convenience
                // Note: This requires polling the outputs again from the executor if we want the latest values
                // But since syncToSchematic consumes the simulation state, we might not be able to query outputs directly afterwards
                // unless we re-create the executor or if syncToSchematic keeps the simulation alive.
                // Based on mchprs logic, sync usually updates the schematic data.
            },
            executor,
        };
    }
    getPalettes(schematic) {
        // Safety check for get_all_palettes
        if (typeof schematic.get_all_palettes === "function") {
            return schematic.get_all_palettes();
        }
        console.warn("[SchematicObject] get_all_palettes missing, falling back to get_palette");
        // Fallback to get_palette
        if (typeof schematic.get_palette === "function") {
            return { default: schematic.get_palette() };
        }
        console.error("[SchematicObject] Both get_all_palettes and get_palette are missing!");
        return { default: [] };
    }
    getBlockEntitiesMap() {
        if (this.blockEntitiesMap === null) {
            this.blockEntitiesMap = new Map();
            const entities = this.schematicWrapper.get_all_block_entities() || [];
            for (const entity of entities) {
                if (entity && entity.position && entity.position.length === 3) {
                    const key = `${entity.position[0]},${entity.position[1]},${entity.position[2]}`;
                    this.blockEntitiesMap.set(key, entity);
                }
            }
        }
        return this.blockEntitiesMap;
    }
    async setBlockNoRebuild(position, blockType) {
        // performanceMonitor.startOperation("setBlockNoRebuild"); // Too much overhead for bulk operations
        if (Array.isArray(position)) {
            position = new THREE.Vector3(position[0], position[1], position[2]);
        }
        this.schematicWrapper.set_block(position.x, position.y, position.z, blockType);
        // Invalidate cached dimensions since we modified the schematic
        this._cachedDimensions = null;
        this.blockEntitiesMap = null;
        // performanceMonitor.endOperation("setBlockNoRebuild");
    }
    async setBlockWithNbt(position, blockType, nbtData) {
        performanceMonitor.startOperation("setBlockWithNbt");
        if (Array.isArray(position)) {
            position = new THREE.Vector3(position[0], position[1], position[2]);
        }
        this.schematicWrapper.setBlockWithNbt(position.x, position.y, position.z, blockType, nbtData);
        performanceMonitor.endOperation("setBlockWithNbt");
    }
    /**
     * Compiles Insign annotations from sign blocks in the schematic
     * @returns Raw Insign data (DslMap) or null if compilation fails
     */
    compileInsign() {
        try {
            return this.schematicWrapper.compileInsign();
        }
        catch (e) {
            console.warn("[SchematicObject] Insign compilation failed:", e);
            return null;
        }
    }
    async setBlock(position, blockType) {
        if (Array.isArray(position)) {
            position = new THREE.Vector3(position[0], position[1], position[2]);
        }
        await this.setBlockNoRebuild(position, blockType);
        await this.rebuildChunkAtPosition(position);
    }
    // Optimized batch block setting
    async setBlocks(blocks) {
        const affectedChunks = new Set();
        let startTime = performance.now();
        performanceMonitor.startOperation("setBlocks");
        console.log("Setting blocks");
        resetPerformanceMetrics();
        // Batch all block updates first
        for (let [position, blockType] of blocks) {
            if (Array.isArray(position)) {
                position = new THREE.Vector3(position[0], position[1], position[2]);
            }
            await this.setBlockNoRebuild(position, blockType);
            const chunkCoords = this.getChunkCoordinates(position);
            affectedChunks.add(`${chunkCoords.x},${chunkCoords.y},${chunkCoords.z}`);
        }
        console.log("Blocks set");
        performanceMonitor.endOperation("setBlocks");
        console.log("Time to set blocks:", performance.now() - startTime + "ms");
        startTime = performance.now();
        console.log("Rebuilding chunks");
        // Rebuild all affected chunks in parallel
        const rebuildPromises = [];
        for (const chunk of affectedChunks) {
            const [chunkX, chunkY, chunkZ] = chunk.split(",").map((v) => parseInt(v));
            rebuildPromises.push(this.rebuildChunk(chunkX, chunkY, chunkZ));
        }
        // Wait for all chunks to rebuild
        await Promise.all(rebuildPromises);
        console.log("Chunks rebuilt in", performance.now() - startTime + "ms");
    }
    async copyRegionFromSchematic(sourceSchematicName, sourceMin, sourceMax, targetPosition, excludeBlocks, rebuild = false) {
        const sourceSchematic = this.sceneManager?.schematicRenderer?.schematicManager?.getSchematic(sourceSchematicName);
        if (!sourceSchematic) {
            throw new Error(`Schematic ${sourceSchematicName} not found`);
        }
        if (Array.isArray(sourceMin)) {
            sourceMin = new THREE.Vector3(sourceMin[0], sourceMin[1], sourceMin[2]);
        }
        if (Array.isArray(sourceMax)) {
            sourceMax = new THREE.Vector3(sourceMax[0], sourceMax[1], sourceMax[2]);
        }
        if (Array.isArray(targetPosition)) {
            targetPosition = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);
        }
        const sourceDimensions = sourceSchematic.getDimensions();
        if (!sourceMin) {
            sourceMin = new THREE.Vector3(0, 0, 0);
        }
        if (!sourceMax) {
            sourceMax = new THREE.Vector3(sourceDimensions[0] - 1, sourceDimensions[1] - 1, sourceDimensions[2] - 1);
        }
        if (!targetPosition) {
            targetPosition = new THREE.Vector3(0, 0, 0);
        }
        if (!excludeBlocks) {
            excludeBlocks = [];
        }
        await this.schematicWrapper.copy_region(sourceSchematic.schematicWrapper, sourceMin.x, sourceMin.y, sourceMin.z, sourceMax.x, sourceMax.y, sourceMax.z, targetPosition.x, targetPosition.y, targetPosition.z, excludeBlocks);
        if (rebuild) {
            await this.rebuildMesh();
        }
    }
    getBlock(position) {
        if (Array.isArray(position)) {
            position = new THREE.Vector3(position[0], position[1], position[2]);
        }
        return this.schematicWrapper.get_block(position.x, position.y, position.z);
    }
    debugBlock(position) {
        const x = Math.floor(position.x);
        const y = Math.floor(position.y);
        const z = Math.floor(position.z);
        console.log(`🔍 Debug Block at (${x}, ${y}, ${z}):`);
        const blockType = this.schematicWrapper.get_block(x, y, z);
        console.log(`Type: ${blockType}`);
        try {
            // @ts-ignore
            const blockState = this.schematicWrapper.get_block_with_properties?.(x, y, z);
            if (blockState) {
                console.log(`Properties:`, blockState.properties());
            }
        }
        catch (e) {
            console.warn("Could not get block properties:", e);
        }
        try {
            const sim = this.schematicWrapper.create_simulation_world();
            console.log(`Redstone Power: ${sim.get_redstone_power(x, y, z)}`);
            // @ts-ignore
            if (sim.is_lit) {
                // @ts-ignore
                console.log(`Is Lit: ${sim.is_lit(x, y, z)}`);
            }
            sim.free();
        }
        catch (e) {
            console.warn("Could not check simulation state:", e);
        }
    }
    async replaceBlock(replaceBlock, newBlock) {
        const blocks = [];
        const dimensions = this.getDimensions();
        for (let x = 0; x < dimensions[0]; x++) {
            for (let y = 0; y < dimensions[1]; y++) {
                for (let z = 0; z < dimensions[2]; z++) {
                    const block = this.schematicWrapper.get_block(x, y, z);
                    if (block === replaceBlock) {
                        blocks.push([new THREE.Vector3(x, y, z), newBlock]);
                    }
                }
            }
        }
        await this.setBlocks(blocks);
    }
    async addCube(position, size, blockType) {
        if (Array.isArray(position)) {
            position = new THREE.Vector3(position[0], position[1], position[2]);
        }
        if (Array.isArray(size)) {
            size = new THREE.Vector3(size[0], size[1], size[2]);
        }
        const blocks = [];
        for (let x = 0; x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                for (let z = 0; z < size.z; z++) {
                    blocks.push([position.clone().add(new THREE.Vector3(x, y, z)), blockType]);
                }
            }
        }
        await this.setBlocks(blocks);
        return this;
    }
    async rebuildChunkAtPosition(position) {
        const chunkCoords = this.getChunkCoordinates(position);
        await this.rebuildChunk(chunkCoords.x, chunkCoords.y, chunkCoords.z);
    }
    rebuildAllChunks() {
        // Rebuild all chunks by triggering a full mesh rebuild
        this.rebuildMesh();
    }
    getChunkCoordinates(position) {
        return {
            x: Math.floor(position.x / this.chunkDimensions.chunkWidth),
            y: Math.floor(position.y / this.chunkDimensions.chunkHeight),
            z: Math.floor(position.z / this.chunkDimensions.chunkLength),
        };
    }
    async rebuildChunk(chunkX, chunkY, chunkZ) {
        const chunkOffset = {
            x: chunkX * this.chunkDimensions.chunkWidth,
            y: chunkY * this.chunkDimensions.chunkHeight,
            z: chunkZ * this.chunkDimensions.chunkLength,
        };
        // Check if chunk is outside rendering bounds - if so, just remove it
        if (this.renderingBounds) {
            const chunkMaxX = chunkOffset.x + this.chunkDimensions.chunkWidth;
            const chunkMaxY = chunkOffset.y + this.chunkDimensions.chunkHeight;
            const chunkMaxZ = chunkOffset.z + this.chunkDimensions.chunkLength;
            // If the chunk is completely outside rendering bounds, just remove it
            if (chunkMaxX <= this.renderingBounds.min.x ||
                chunkOffset.x >= this.renderingBounds.max.x ||
                chunkMaxY <= this.renderingBounds.min.y ||
                chunkOffset.y >= this.renderingBounds.max.y ||
                chunkMaxZ <= this.renderingBounds.min.z ||
                chunkOffset.z >= this.renderingBounds.max.z) {
                this.removeChunkObjects(chunkX, chunkY, chunkZ);
                return;
            }
        }
        // Use WASM optimization to get both blocks and pre-filtered entities
        // Cast to any as TS definitions might not be up to date immediately
        let chunkData;
        let blocks;
        let entities;
        // Check if the new method exists (it should with nucleation 0.1.116)
        if (this.schematicWrapper.getChunkData) {
            chunkData = this.schematicWrapper.getChunkData(chunkX, chunkY, chunkZ, this.chunkDimensions.chunkWidth, this.chunkDimensions.chunkHeight, this.chunkDimensions.chunkLength);
            blocks = chunkData.blocks;
            entities = chunkData.entities;
        }
        else {
            // Fallback for older versions
            blocks = this.schematicWrapper.get_chunk_blocks_indices(chunkOffset.x, chunkOffset.y, chunkOffset.z, this.chunkDimensions.chunkWidth, this.chunkDimensions.chunkHeight, this.chunkDimensions.chunkLength);
        }
        // Remove old chunk objects from the scene
        this.removeChunkObjects(chunkX, chunkY, chunkZ);
        // Build new chunk objects using the optimized format
        const newChunkObjects = await this.worldMeshBuilder.getChunkMesh({
            blocks: blocks, // This is already in format: [[x,y,z,paletteIndex],...]
            chunk_x: chunkX,
            chunk_y: chunkY,
            chunk_z: chunkZ,
        }, this, this.renderingBounds, entities // Pass pre-filtered entities if available
        );
        // Apply properties to the new objects
        this.applyPropertiesToObjects(newChunkObjects);
        newChunkObjects.forEach((obj) => {
            this.group.add(obj);
        });
        // Update the chunk object reference in chunkMeshes map
        this.setChunkObjectsAt(chunkX, chunkY, chunkZ, newChunkObjects);
    }
    removeChunkObjects(chunkX, chunkY, chunkZ) {
        const oldChunkObjects = this.getChunkObjectsAt(chunkX, chunkY, chunkZ);
        if (oldChunkObjects) {
            oldChunkObjects.forEach((obj) => {
                this.group.remove(obj);
                // Dispose of geometries and materials within the object
                obj.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.geometry?.dispose();
                        if (Array.isArray(child.material)) {
                            child.material.forEach((material) => material.dispose());
                        }
                        else {
                            child.material?.dispose();
                        }
                    }
                });
            });
            this.chunkMeshes.delete(`${chunkX},${chunkY},${chunkZ}`);
        }
    }
    containsPosition(position) {
        // Calculate the bounds of the schematic
        const dimensions = this.getDimensions();
        const min = this.position.clone();
        const max = min
            .clone()
            .add(new THREE.Vector3(dimensions[0], dimensions[1], dimensions[2]).multiply(this.scale));
        return (position.x >= min.x &&
            position.x <= max.x &&
            position.y >= min.y &&
            position.y <= max.y &&
            position.z >= min.z &&
            position.z <= max.z);
    }
    getSchematicCenter() {
        const box = this.getTightWorldBox();
        return box.getCenter(new THREE.Vector3());
    }
    /**
     * Get the world-space bounding box of the schematic's actual block content
     */
    getTightWorldBox() {
        const tightMin = this.getTightBoundsMin();
        const tightDimensions = this.getTightDimensions();
        const hasTightBounds = tightMin !== null &&
            tightDimensions[0] > 0 &&
            tightDimensions[1] > 0 &&
            tightDimensions[2] > 0;
        const box = new THREE.Box3();
        if (hasTightBounds) {
            box.min.set(tightMin[0], tightMin[1], tightMin[2]);
            box.max.set(tightMin[0] + tightDimensions[0], tightMin[1] + tightDimensions[1], tightMin[2] + tightDimensions[2]);
        }
        else {
            const dims = this.getDimensions();
            box.min.set(0, 0, 0);
            box.max.set(dims[0], dims[1], dims[2]);
        }
        // Apply the group's transform
        this.group.updateMatrixWorld(true);
        box.applyMatrix4(this.group.matrixWorld);
        return box;
    }
    centerInScene() {
        const averagePosition = this.getSchematicCenter();
        const newSchematicPosition = new THREE.Vector3(this.position.x - averagePosition.x, this.position.y - averagePosition.y, this.position.z - averagePosition.z);
        this.position.copy(newSchematicPosition);
        this.updateTransform();
    }
    centerInScenePlane() {
        const averagePosition = this.getSchematicCenter();
        const newSchematicPosition = new THREE.Vector3(this.position.x - averagePosition.x, 0, this.position.z - averagePosition.z);
        this.position.copy(newSchematicPosition);
        this.updateTransform();
    }
    setPosition(position) {
        if (Array.isArray(position)) {
            this.position = new THREE.Vector3(position[0], position[1], position[2]);
            this.updateTransform();
            return;
        }
        this.position = position;
        this.updateTransform();
    }
    setRotation(rotation) {
        if (Array.isArray(rotation)) {
            this.rotation = new THREE.Euler(rotation[0], rotation[1], rotation[2]);
            return;
        }
        this.rotation = rotation;
    }
    setScale(scale) {
        if (Array.isArray(scale)) {
            this.scale = new THREE.Vector3(scale[0], scale[1], scale[2]);
            return;
        }
        this.scale = scale;
    }
    getWorldPosition() {
        return this.group.getWorldPosition(new THREE.Vector3());
    }
    getBoundingBox() {
        // Get the actual world-space bounds after centering
        this.group.updateMatrixWorld();
        const box = new THREE.Box3().setFromObject(this.group);
        const min = [box.min.x, box.min.y, box.min.z];
        const max = [box.max.x, box.max.y, box.max.z];
        return [min, max];
    }
    // Optimized getAllBlocks method with optional filtering
    getAllBlocks(filter) {
        const dimensions = this.getDimensions();
        const blocks = [];
        for (let x = 0; x < dimensions[0]; x++) {
            for (let y = 0; y < dimensions[1]; y++) {
                for (let z = 0; z < dimensions[2]; z++) {
                    const blockName = this.schematicWrapper.get_block(x, y, z);
                    if (blockName && blockName !== "minecraft:air") {
                        // Get block properties using the correct method name
                        let properties = {};
                        try {
                            const blockWithProps = this.schematicWrapper.get_block_with_properties?.(x, y, z);
                            if (blockWithProps) {
                                // Extract properties from BlockStateWrapper if available
                                properties = blockWithProps.properties || {};
                            }
                        }
                        catch (error) {
                            // Fallback to empty properties if method doesn't exist or fails
                            properties = {};
                        }
                        const blockData = {
                            x,
                            y,
                            z,
                            name: blockName,
                            properties: properties,
                            chunk_x: Math.floor(x / this.chunkDimensions.chunkWidth),
                            chunk_y: Math.floor(y / this.chunkDimensions.chunkHeight),
                            chunk_z: Math.floor(z / this.chunkDimensions.chunkLength),
                            stateKey: `${blockName}${Object.keys(properties).length > 0
                                ? `[${Object.entries(properties)
                                    .map(([k, v]) => `${k}=${v}`)
                                    .join(",")}]`
                                : ""}`, // Generate stateKey
                        };
                        // Apply filter if provided
                        if (!filter || filter(blockData)) {
                            blocks.push(blockData);
                        }
                    }
                }
            }
        }
        return blocks;
    }
    /**
     * Creates an object with properties and methods for easily manipulating rendering bounds
     * Useful for console manipulation and testing
     * @returns Settings object with properties and methods
     */
    createBoundsControls() {
        const dimensions = this.getDimensions();
        const [width, height, depth] = dimensions;
        const settings = {
            minX: this.renderingBounds.min.x,
            maxX: this.renderingBounds.max.x,
            minY: this.renderingBounds.min.y,
            maxY: this.renderingBounds.max.y,
            minZ: this.renderingBounds.min.z,
            maxZ: this.renderingBounds.max.z,
            // Apply a specific axis
            applyX: () => {
                const min = this.renderingBounds.min.clone();
                const max = this.renderingBounds.max.clone();
                min.x = settings.minX;
                max.x = settings.maxX;
                this.setRenderingBounds(min, max);
                return `X axis bounds set to [${settings.minX}, ${settings.maxX}]`;
            },
            applyY: () => {
                const min = this.renderingBounds.min.clone();
                const max = this.renderingBounds.max.clone();
                min.y = settings.minY;
                max.y = settings.maxY;
                this.setRenderingBounds(min, max);
                return `Y axis bounds set to [${settings.minY}, ${settings.maxY}]`;
            },
            applyZ: () => {
                const min = this.renderingBounds.min.clone();
                const max = this.renderingBounds.max.clone();
                min.z = settings.minZ;
                max.z = settings.maxZ;
                this.setRenderingBounds(min, max);
                return `Z axis bounds set to [${settings.minZ}, ${settings.maxZ}]`;
            },
            // Apply all axes
            applyAll: () => {
                this.setRenderingBounds([settings.minX, settings.minY, settings.minZ], [settings.maxX, settings.maxY, settings.maxZ]);
                return `All bounds set to min:[${settings.minX}, ${settings.minY}, ${settings.minZ}], max:[${settings.maxX}, ${settings.maxY}, ${settings.maxZ}]`;
            },
            // Reset to full dimensions
            reset: () => {
                this.resetRenderingBounds();
                // Update local settings to match
                settings.minX = 0;
                settings.maxX = width;
                settings.minY = 0;
                settings.maxY = height;
                settings.minZ = 0;
                settings.maxZ = depth;
                return `Reset rendering bounds to full dimensions: [${width}, ${height}, ${depth}]`;
            },
            // Toggle helper visibility
            toggleHelper: (visible = true) => {
                this.showRenderingBoundsHelper(visible);
                return `Rendering bounds helper ${visible ? "shown" : "hidden"}`;
            },
            // Get current bounds
            getCurrentBounds: () => {
                return {
                    min: this.renderingBounds.min.toArray(),
                    max: this.renderingBounds.max.toArray(),
                };
            },
            // Sync from current bounds
            syncFromCurrent: () => {
                settings.minX = this.renderingBounds.min.x;
                settings.maxX = this.renderingBounds.max.x;
                settings.minY = this.renderingBounds.min.y;
                settings.maxY = this.renderingBounds.max.y;
                settings.minZ = this.renderingBounds.min.z;
                settings.maxZ = this.renderingBounds.max.z;
                return "Settings synchronized with current bounds";
            },
            // Slice from one side (useful for slider UI)
            sliceX: (value) => {
                settings.maxX = value;
                return settings.applyX();
            },
            sliceY: (value) => {
                settings.maxY = value;
                return settings.applyY();
            },
            sliceZ: (value) => {
                settings.maxZ = value;
                return settings.applyZ();
            },
        };
        return settings;
    }
}
