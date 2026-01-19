import initializeNucleationWasm from "nucleation";
// @ts-ignore
import nucleationWasm from "nucleation-wasm";
// Initialize with inlined WASM for single-file support
// await initializeNucleationWasm(nucleationWasm);
import * as THREE from "three";
import { CameraManager } from "./managers/CameraManager";
import { SceneManager } from "./managers/SceneManager";
import { RenderManager } from "./managers/RenderManager";
import { DragAndDropManager } from "./managers/DragAndDropManager";
import { InteractionManager } from "./managers/InteractionManager";
import { HighlightManager } from "./managers/HighlightManager";
import { SchematicManager } from "./managers/SchematicManager";
import { WorldMeshBuilder } from "./WorldMeshBuilder";
import { MaterialRegistry } from "./MaterialRegistry";
import { EventEmitter } from "events";
import { ResourcePackManager } from "./managers/ResourcePackManager";
import { ResourcePackManagerProxy } from "./managers/ResourcePackManagerProxy";
import { ResourcePackUI } from "./ui/ResourcePackUI";
import { ExportUI } from "./ui/ExportUI";
import { RenderSettingsUI } from "./ui/RenderSettingsUI";
import { CaptureUI } from "./ui/CaptureUI";
import { GizmoManager } from "./managers/GizmoManager";
import { DEFAULT_OPTIONS } from "./SchematicRendererOptions";
import { merge } from "lodash";
import { UIManager } from "./managers/UIManager";
import { SimulationManager } from "./managers/SimulationManager";
import { BlockInteractionHandler } from "./managers/highlight/BlockInteractionHandler";
import { InsignManager } from "./managers/InsignManager";
import { InsignIoManager } from "./managers/InsignIoManager";
import { OverlayManager } from "./managers/OverlayManager";
// @ts-ignore
import { CreativeControls } from "three-creative-controls";
import { Cubane } from "cubane";
import { performanceDashboard } from "./ui/PerformanceDashboard";
import { KeyboardControls } from "./managers/KeyboardControls";
import { InspectorManager } from "./managers/InspectorManager";
import { RegionManager } from "./managers/RegionManager";
import { RegionInteractionHandler } from "./managers/highlight/RegionInteractionHandler";
export class SchematicRenderer {
    constructor(canvas, schematicData = {}, defaultResourcePacks = {}, options = {}) {
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clock", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "options", {
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
        Object.defineProperty(this, "cameraManager", {
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
        Object.defineProperty(this, "uiManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "renderManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "interactionManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dragAndDropManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "highlightManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "schematicManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "worldMeshBuilder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gizmoManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "simulationManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "blockInteractionHandler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "insignManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "insignIoManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "regionManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "regionInteractionHandler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "overlayManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "keyboardControls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inspectorManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "materialMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "fps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "resourcePackManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "packs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "resourcePackUI", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exportUI", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "renderSettingsUI", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "captureUI", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cubane", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastFrameTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "targetFPS", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "idleFPS", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "enableAdaptiveFPS", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "idleThreshold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "frameInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "animationFrameId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isDisposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "frameCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "lastDebugTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "throttledFrames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        // Adaptive FPS tracking
        Object.defineProperty(this, "lastCameraPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new THREE.Vector3()
        });
        Object.defineProperty(this, "lastCameraQuaternion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new THREE.Quaternion()
        });
        Object.defineProperty(this, "lastInteractionTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "isIdle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "idleTimeoutId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "pointerEventBound", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "wakeUpHandler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.canvas = canvas;
        this.options = merge({}, DEFAULT_OPTIONS, options);
        // Initialize FPS settings from options
        this.targetFPS = this.options.targetFPS ?? 60;
        this.idleFPS = this.options.idleFPS ?? 1;
        this.enableAdaptiveFPS = this.options.enableAdaptiveFPS ?? true;
        this.idleThreshold = this.options.idleThreshold ?? 100;
        this.frameInterval = this.targetFPS > 0 ? 1000 / this.targetFPS : 0;
        this.clock = new THREE.Clock();
        this.materialMap = new Map();
        this.eventEmitter = new EventEmitter();
        // Attach this instance to the canvas for external access
        this.canvas.schematicRenderer = this;
        // Initialize managers that don't depend on initialization process
        this.sceneManager = new SceneManager(this);
        this.uiManager = new UIManager(this);
        // Initialize camera manager
        this.cameraManager = new CameraManager(this, options.cameraOptions);
        // Initialize keyboard controls
        if (options.keyboardControlsOptions?.enabled !== false) {
            this.keyboardControls = new KeyboardControls(this.cameraManager.activeCamera.camera, this.canvas, options.keyboardControlsOptions);
        }
        this.sceneManager.updateHelpers();
        this.eventEmitter.emit("sceneReady");
        // Initialize ResourcePackManager with options
        this.resourcePackManager = new ResourcePackManager(this.options.resourcePackOptions);
        // Create proxy for external API access
        this.packs = new ResourcePackManagerProxy(this.resourcePackManager);
        // Wire up resource pack callbacks
        this.setupResourcePackCallbacks();
        // Initialize Resource Pack UI if enabled
        if (this.options.resourcePackOptions?.enableUI !== false) {
            this.resourcePackUI = new ResourcePackUI(this.resourcePackManager, this.canvas, this.options.resourcePackOptions);
        }
        // Initialize Export UI
        this.exportUI = new ExportUI(this.canvas, () => this.schematicManager?.getFirstSchematic() || null, {
            enableUI: options.exportUIOptions?.enableUI ?? true,
            uiPosition: options.exportUIOptions?.uiPosition ?? "top-right",
            enableKeyboardShortcuts: options.exportUIOptions?.enableKeyboardShortcuts ?? true,
            toggleUIShortcut: options.exportUIOptions?.toggleUIShortcut ?? "KeyE",
        });
        // Configure performance dashboard with options
        if (options.performanceDashboardOptions) {
            performanceDashboard.configure(options.performanceDashboardOptions);
        }
        // Initialize Render Settings UI
        this.renderSettingsUI = new RenderSettingsUI(this, {
            enableUI: options.renderSettingsUIOptions?.enableUI ?? true,
            uiPosition: options.renderSettingsUIOptions?.uiPosition ?? "top-right",
            enableKeyboardShortcuts: options.renderSettingsUIOptions?.enableKeyboardShortcuts ?? true,
            toggleUIShortcut: options.renderSettingsUIOptions?.toggleUIShortcut ?? "KeyR",
            onSettingsChange: (settings) => {
                this.options.callbacks?.onRenderSettingsChanged?.(settings);
            },
        });
        // Initialize Capture UI
        this.captureUI = new CaptureUI(this, {
            enableUI: options.captureUIOptions?.enableUI ?? true,
            uiPosition: options.captureUIOptions?.uiPosition ?? "top-right",
            enableKeyboardShortcuts: options.captureUIOptions?.enableKeyboardShortcuts ?? true,
            toggleUIShortcut: options.captureUIOptions?.toggleUIShortcut ?? "KeyC",
            onScreenshotTaken: (blob, filename) => {
                this.options.callbacks?.onScreenshotTaken?.(blob, filename);
            },
            onRecordingComplete: (blob, filename) => {
                this.options.callbacks?.onRecordingComplete?.(blob, filename);
            },
        });
        this.state = {
            cameraPosition: new THREE.Vector3(),
        };
        // Show initialization progress bar
        if (this.options.enableProgressBar && this.uiManager) {
            this.uiManager.showProgressBar("Initializing renderer...");
            this.uiManager.updateProgress(0.1);
        }
        this.cubane = new Cubane();
        // Bind pointer events for immediate wake-up from idle mode
        this.bindPointerEvents();
        // Start the initialization process
        this.initialize(schematicData, defaultResourcePacks);
    }
    updateCameraPosition() {
        this.state.cameraPosition.copy(this.cameraManager.activeCamera.position);
    }
    /**
     * Sets whether auto-orbit is enabled
     * @param enabled True to enable auto-orbit, false to disable
     */
    setAutoOrbit(enabled) {
        this.options.enableAutoOrbit = enabled;
        if (enabled) {
            this.cameraManager.startAutoOrbit();
        }
        else {
            this.cameraManager.stopAutoOrbit();
        }
    }
    /**
     * Sets the duration of a full auto-orbit rotation
     * @param duration Duration in seconds
     */
    setAutoOrbitDuration(duration) {
        this.options.autoOrbitDuration = duration;
        this.cameraManager.setAutoOrbitDuration(duration);
    }
    /**
     * Toggles the auto-orbit feature
     * @returns The new state of auto-orbit (true = enabled, false = disabled)
     */
    toggleAutoOrbit() {
        const newState = this.cameraManager.toggleAutoOrbit();
        this.options.enableAutoOrbit = newState;
        return newState;
    }
    /**
     * Enable or create the inspector GUI
     * Can be called at any time to show the debug panel
     */
    enableInspector() {
        if (!this.inspectorManager) {
            this.inspectorManager = new InspectorManager(this, {
                enableInspector: true,
                showOnStartup: true,
                ...this.options.debugOptions,
            });
        }
        else {
            this.inspectorManager.show();
        }
        return this.inspectorManager;
    }
    /**
     * Disable/hide the inspector GUI
     */
    disableInspector() {
        if (this.inspectorManager) {
            this.inspectorManager.hide();
        }
    }
    /**
     * Toggle the inspector GUI visibility
     * Creates the inspector if it doesn't exist
     */
    toggleInspector() {
        if (!this.inspectorManager) {
            this.enableInspector();
            return true;
        }
        this.inspectorManager.toggle();
        return this.inspectorManager.visible;
    }
    async initialize(schematicData, defaultResourcePacks) {
        try {
            // Update progress bar for each initialization step
            const showProgress = (message, progress) => {
                if (this.options.enableProgressBar && this.uiManager) {
                    this.uiManager.updateProgress(progress, message);
                }
            };
            // Step 1: Initialize WebAssembly module
            showProgress("Loading WebAssembly module...", 0.15);
            // Wasm is already initialized at module level
            if (!SchematicRenderer.isNucleationInitialized) {
                await initializeNucleationWasm(nucleationWasm);
                SchematicRenderer.isNucleationInitialized = true;
            }
            // Step 2: Initialize resource packs
            showProgress("Initializing resource packs...", 0.3);
            await this.initializeResourcePacks(defaultResourcePacks);
            // Step 4: Initialize builders and managers
            showProgress("Setting up renderer components...", 0.6);
            this.worldMeshBuilder = new WorldMeshBuilder(this, this.cubane);
            // Enable greedy meshing if configured
            if (this.options.wasmMeshBuilderOptions?.greedyMeshingEnabled) {
                this.worldMeshBuilder.setGreedyMeshing(true);
            }
            const schematicManagerOptions = {
                singleSchematicMode: this.options.singleSchematicMode,
                callbacks: {
                    onSchematicFileLoaded: this.options?.callbacks?.onSchematicFileLoaded,
                    onSchematicFileLoadFailure: this.options?.callbacks?.onSchematicFileLoadFailure,
                },
            };
            this.schematicManager = new SchematicManager(this, schematicManagerOptions);
            // Initialize RenderManager (async for WebGPU support)
            this.renderManager = new RenderManager(this);
            await this.renderManager.initialize();
            // Log renderer type
            if (this.renderManager.isWebGPU) {
                console.log("%c[SchematicRenderer] Using WebGPU Renderer", "color: #4caf50; font-weight: bold");
            }
            else {
                console.log("[SchematicRenderer] Using WebGL Renderer");
            }
            this.highlightManager = new HighlightManager(this);
            this.insignManager = new InsignManager(this);
            this.insignIoManager = new InsignIoManager(this);
            this.regionManager = new RegionManager(this);
            this.regionInteractionHandler = new RegionInteractionHandler(this);
            this.overlayManager = new OverlayManager(this);
            // Initialize optional components
            if (this.options.enableGizmos) {
                this.gizmoManager = new GizmoManager(this);
            }
            // Step 5: Load initial schematics if provided
            if (Object.keys(schematicData).length > 0) {
                showProgress("Loading initial schematics...", 0.75);
                await this.schematicManager.loadSchematics(schematicData);
            }
            // Step 6: Setup camera and interaction
            showProgress("Finalizing setup...", 0.9);
            // Use the improved focusOnSchematics for better auto-framing
            if (!this.schematicManager.isEmpty()) {
                this.cameraManager.focusOnSchematics({ animationDuration: 0 });
            }
            this.initializeInteractionComponents();
            // Initialization complete
            showProgress("Ready", 1.0);
            // Start rendering
            this.animate();
            // Initialize inspector if enabled
            if (this.options.debugOptions?.enableInspector) {
                this.inspectorManager = new InspectorManager(this, this.options.debugOptions);
            }
            // Trigger callbacks and events
            this.options.callbacks?.onRendererInitialized?.(this);
            this.canvas.dispatchEvent(new CustomEvent("rendererInitialized"));
            // Hide progress bar after a short delay to show completion state
            setTimeout(() => {
                if (this.options.enableProgressBar && this.uiManager) {
                    this.uiManager.hideProgressBar();
                }
            }, 500);
        }
        catch (error) {
            console.error("Failed to initialize SchematicRenderer:", error);
            // Show error in progress bar
            if (this.options.enableProgressBar && this.uiManager) {
                this.uiManager.updateProgress(1.0, "Initialization failed");
                setTimeout(() => this.uiManager?.hideProgressBar(), 2000);
            }
            console.error(error);
        }
    }
    initializeInteractionComponents() {
        // Initialize simulation manager if enabled
        if (this.options.simulationOptions?.enableSimulation) {
            this.simulationManager = new SimulationManager(this.eventEmitter);
            // Hook up simulation callbacks through eventEmitter
            this.eventEmitter.on("simulationInitialized", () => {
                if (this.schematicManager) {
                    const firstSchematic = this.schematicManager.getFirstSchematic();
                    if (firstSchematic) {
                        this.options.callbacks?.onSimulationInitialized?.(firstSchematic.id);
                    }
                }
            });
            this.eventEmitter.on("blockInteracted", (data) => {
                const [x, y, z] = data.position || [0, 0, 0];
                this.options.callbacks?.onBlockInteracted?.(x, y, z);
            });
            this.eventEmitter.on("simulationTicked", (data) => {
                this.options.callbacks?.onSimulationTicked?.(data.tickCount || 0);
            });
            this.eventEmitter.on("simulationSynced", (data) => {
                this.options.callbacks?.onSimulationSynced?.();
                // Update the schematic wrapper with the synced state before rebuilding
                const updatedSchematic = data.updatedSchematic;
                if (updatedSchematic) {
                    const firstSchematic = this.schematicManager?.getFirstSchematic();
                    if (firstSchematic) {
                        firstSchematic.schematicWrapper = updatedSchematic;
                    }
                }
                // Rebuild meshes after sync
                this.rebuildAllChunks();
            });
            this.eventEmitter.on("simulationError", (data) => {
                this.options.callbacks?.onSimulationError?.(data.error);
            });
            // Configure auto-tick if specified
            if (this.options.simulationOptions.autoTickSpeed) {
                this.simulationManager.setTickSpeed(this.options.simulationOptions.autoTickSpeed);
            }
        }
        // Initialize block interaction handler
        if (this.schematicManager) {
            this.blockInteractionHandler = new BlockInteractionHandler(this.eventEmitter, this.schematicManager, this.simulationManager);
        }
        if (this.options.enableInteraction) {
            const interactionOptions = {
                enableSelection: this.options.interactionOptions?.enableSelection || false,
                enableMovingSchematics: this.options.interactionOptions?.enableMovingSchematics || false,
            };
            this.interactionManager = new InteractionManager(this, interactionOptions);
        }
        if (this.options.enableDragAndDrop) {
            const dragAndDropOptions = {
                acceptedFileTypes: this.options.dragAndDropOptions?.acceptedFileTypes || [
                    "schematic",
                    "nbt",
                    "schem",
                    "litematic",
                    "mcstructure",
                ],
                callbacks: {
                    // Schematic callbacks
                    onSchematicLoaded: this.options.callbacks?.onSchematicLoaded,
                    onSchematicDropped: this.options.callbacks?.onSchematicDropped,
                    onSchematicDropSuccess: this.options.callbacks?.onSchematicDropSuccess,
                    onSchematicDropFailed: this.options.callbacks?.onSchematicDropFailed,
                    // Resource pack callbacks
                    onResourcePackLoaded: this.options.callbacks?.onResourcePackLoaded,
                    onResourcePackDropped: this.options.callbacks?.onResourcePackDropped,
                    onResourcePackDropSuccess: this.options.callbacks?.onResourcePackDropSuccess,
                    onResourcePackDropFailed: this.options.callbacks?.onResourcePackDropFailed,
                    // General callbacks
                    onInvalidFileType: this.options.callbacks?.onInvalidFileType,
                    onLoadingProgress: this.options.callbacks?.onLoadingProgress,
                },
            };
            this.dragAndDropManager = new DragAndDropManager(this, dragAndDropOptions);
        }
    }
    /**
     * Set up callbacks for resource pack events
     */
    setupResourcePackCallbacks() {
        const callbacks = this.options.callbacks;
        const rpCallbacks = this.options.resourcePackOptions;
        // Pack changed events
        this.resourcePackManager.on("packsChanged", (event) => {
            callbacks?.onPacksChanged?.(event.reason);
            rpCallbacks?.onPacksChanged?.(event);
        });
        // Pack toggled events
        this.resourcePackManager.on("packToggled", (event) => {
            callbacks?.onPackToggled?.(event.packId, event.enabled);
            rpCallbacks?.onPackToggled?.(event.packId, event.enabled);
        });
        // Atlas rebuild events
        this.resourcePackManager.on("atlasRebuilt", (event) => {
            callbacks?.onAtlasRebuilt?.(event.textureCount);
            rpCallbacks?.onAtlasRebuilt?.();
        });
        // Pack added events
        this.resourcePackManager.on("packAdded", (event) => {
            rpCallbacks?.onPackAdded?.(event);
        });
        // Pack removed events
        this.resourcePackManager.on("packRemoved", (event) => {
            rpCallbacks?.onPackRemoved?.(event.packId);
        });
        // Load progress events
        this.resourcePackManager.on("loadProgress", (event) => {
            rpCallbacks?.onLoadProgress?.(event);
        });
        // Load complete events
        this.resourcePackManager.on("loadComplete", (event) => {
            rpCallbacks?.onLoadComplete?.(event);
        });
        // Load error events
        this.resourcePackManager.on("loadError", (event) => {
            rpCallbacks?.onLoadError?.(event);
        });
        // Error events
        this.resourcePackManager.on("error", (event) => {
            rpCallbacks?.onError?.(event);
        });
        // Set atlas rebuild callback to reload resources
        // This is called when packs are toggled/changed, so always force reload
        this.resourcePackManager.setAtlasRebuildCallback(async () => {
            console.log("[SchematicRenderer] Atlas rebuild callback invoked - forcing reload");
            await this.reloadResourcePacksIntoCubane(true); // Force reload when packs change
        });
    }
    /**
     * Reload all enabled resource packs into Cubane
     * @param force - Force reload even if Cubane already has packs loaded
     */
    async reloadResourcePacksIntoCubane(force = false) {
        if (!this.cubane)
            return;
        try {
            const enabledPacks = this.resourcePackManager.getEnabledPacksWithBlobs();
            // Only skip on initial load (not forced) if Cubane already has the same number of packs
            if (!force) {
                const cubanePackCount = this.cubane.getPackCount?.() ?? 0;
                if (cubanePackCount > 0 && cubanePackCount >= enabledPacks.length) {
                    console.log(`[SchematicRenderer] Cubane already has ${cubanePackCount} pack(s) loaded, skipping reload`);
                    return;
                }
            }
            // IMPORTANT: In Cubane/Minecraft, packs loaded LAST override earlier packs.
            // Our priority system: lower number = higher priority = should override others.
            // So we need to REVERSE the order: load low-priority packs first, high-priority last.
            const packsToLoad = [...enabledPacks].reverse();
            console.log(`[SchematicRenderer] Reloading ${packsToLoad.length} resource pack(s) into Cubane...`);
            // Use batch mode to clear and reload all packs at once (single atlas rebuild at end)
            this.cubane.beginPackBatchUpdate();
            try {
                // Clear existing packs first (important when packs are disabled)
                await this.cubane.removeAllPacks();
                // Load enabled packs
                for (const pack of packsToLoad) {
                    try {
                        await this.cubane.loadResourcePack(pack.blob);
                        console.log(`  ✓ Loaded: ${pack.name}`);
                    }
                    catch (error) {
                        console.error(`  ✗ Failed to load pack ${pack.name}:`, error);
                    }
                }
            }
            finally {
                // End batch mode - this triggers a single atlas rebuild with all packs
                await this.cubane.endPackBatchUpdate();
            }
            // Clear MaterialRegistry cache so new textures are used
            MaterialRegistry.clear();
            // Invalidate WorldMeshBuilder cache so new textures are used
            if (this.worldMeshBuilder) {
                this.worldMeshBuilder.invalidateCache();
            }
            // Rebuild all loaded schematics with new textures
            await this.rebuildAllSchematics();
            // Trigger event for external listeners
            this.eventEmitter.emit("resourcePacksReloaded");
            console.log("Resource pack reload complete");
        }
        catch (error) {
            console.error("Failed to reload resource packs into Cubane:", error);
        }
    }
    /**
     * Rebuild all loaded schematics (e.g., after resource pack changes)
     */
    async rebuildAllSchematics() {
        if (!this.schematicManager)
            return;
        const schematics = this.schematicManager.getAllSchematics();
        console.log(`Rebuilding ${schematics.length} schematic(s) with updated textures...`);
        for (const schematic of schematics) {
            try {
                await schematic.rebuildMesh();
            }
            catch (error) {
                console.error(`Failed to rebuild schematic ${schematic.name}:`, error);
            }
        }
        // Mark scene as needing update
        if (this.sceneManager?.scene) {
            this.sceneManager.scene.traverse((obj) => {
                if (obj.material) {
                    const mat = obj.material;
                    if (Array.isArray(mat)) {
                        mat.forEach((m) => {
                            if (m)
                                m.needsUpdate = true;
                        });
                    }
                    else {
                        mat.needsUpdate = true;
                    }
                }
            });
        }
        console.log("Schematic rebuild complete");
    }
    async initializeResourcePacks(defaultResourcePacks) {
        await this.resourcePackManager.initPromise;
        // Check if Cubane already has packs loaded (from auto-restore)
        const cubanePackCount = this.cubane.getPackCount?.() ?? 0;
        if (cubanePackCount > 0) {
            console.log(`[SchematicRenderer] Cubane already has ${cubanePackCount} pack(s) from auto-restore, skipping initial pack loading`);
            return;
        }
        // Get resource pack blobs from your existing system
        const resourcePackBlobs = await this.resourcePackManager.getResourcePackBlobs(defaultResourcePacks || {});
        if (resourcePackBlobs.length === 0) {
            console.log("[SchematicRenderer] No resource packs to load");
            return;
        }
        console.log(`[SchematicRenderer] Loading ${resourcePackBlobs.length} resource pack(s)...`);
        // Use batch mode to load all packs at once (single atlas rebuild at the end)
        this.cubane.beginPackBatchUpdate();
        try {
            for (let i = 0; i < resourcePackBlobs.length; i++) {
                const blob = resourcePackBlobs[i];
                try {
                    await this.cubane.loadResourcePack(blob);
                }
                catch (error) {
                    console.error(`Failed to load resource pack ${i + 1}:`, error);
                }
            }
        }
        finally {
            // End batch mode - triggers single atlas rebuild with all packs
            await this.cubane.endPackBatchUpdate();
        }
        // Store the blobs for backward compatibility if needed
        this.options.resourcePackBlobs = resourcePackBlobs;
    }
    /**
     * Bind pointer events to canvas for immediate wake-up from idle mode
     */
    bindPointerEvents() {
        if (this.pointerEventBound)
            return;
        this.wakeUpHandler = () => {
            // Always update interaction time to prevent/exit idle mode
            this.lastInteractionTime = performance.now();
            if (this.isIdle) {
                console.log("[Renderer] Waking up from idle mode due to pointer event");
                this.isIdle = false;
                // Cancel the pending setTimeout if we're in idle mode
                if (this.idleTimeoutId !== null) {
                    clearTimeout(this.idleTimeoutId);
                    this.idleTimeoutId = null;
                }
                // Immediately schedule next frame with requestAnimationFrame
                if (this.animationFrameId !== null) {
                    clearTimeout(this.animationFrameId);
                    this.animationFrameId = null;
                }
                this.animationFrameId = requestAnimationFrame(() => this.animate());
            }
        };
        // Listen to pointer events that indicate user interaction
        this.canvas.addEventListener("pointerdown", this.wakeUpHandler);
        this.canvas.addEventListener("pointermove", this.wakeUpHandler);
        this.canvas.addEventListener("wheel", this.wakeUpHandler);
        this.canvas.addEventListener("touchstart", this.wakeUpHandler);
        this.canvas.addEventListener("touchmove", this.wakeUpHandler);
        this.pointerEventBound = true;
    }
    /**
     * Unbind pointer events
     */
    unbindPointerEvents() {
        if (!this.pointerEventBound || !this.wakeUpHandler)
            return;
        this.canvas.removeEventListener("pointerdown", this.wakeUpHandler);
        this.canvas.removeEventListener("pointermove", this.wakeUpHandler);
        this.canvas.removeEventListener("wheel", this.wakeUpHandler);
        this.canvas.removeEventListener("touchstart", this.wakeUpHandler);
        this.canvas.removeEventListener("touchmove", this.wakeUpHandler);
        this.wakeUpHandler = null;
        this.pointerEventBound = false;
    }
    animate() {
        // Stop animation loop if disposed
        if (this.isDisposed) {
            console.log("[Renderer] Animation loop stopped - disposed");
            return;
        }
        const now = performance.now();
        // Initialize lastDebugTime on first frame
        if (this.lastDebugTime === 0) {
            this.lastDebugTime = now;
            this.lastInteractionTime = now;
            console.log("[Renderer] Animation loop started with adaptive FPS");
        }
        // Adaptive FPS logic (only if enabled)
        let currentTargetFPS = this.targetFPS;
        if (this.enableAdaptiveFPS) {
            // Detect camera movement for adaptive FPS
            const camera = this.cameraManager.activeCamera.camera;
            const cameraMoved = !camera.position.equals(this.lastCameraPosition) ||
                !camera.quaternion.equals(this.lastCameraQuaternion);
            if (cameraMoved) {
                this.lastInteractionTime = now;
                this.lastCameraPosition.copy(camera.position);
                this.lastCameraQuaternion.copy(camera.quaternion);
            }
            // Determine if scene is idle
            const timeSinceInteraction = now - this.lastInteractionTime;
            const wasIdle = this.isIdle;
            this.isIdle = timeSinceInteraction > this.idleThreshold;
            // Adapt frame interval based on idle state
            currentTargetFPS = this.isIdle ? this.idleFPS : this.targetFPS;
            // Log state changes
            if (wasIdle !== this.isIdle) {
                console.log(`[Renderer] ${this.isIdle ? "Entering idle mode" : "Exiting idle mode"} (target FPS: ${currentTargetFPS})`);
            }
        }
        // Update frame interval (0 = uncapped)
        this.frameInterval = currentTargetFPS > 0 ? 1000 / currentTargetFPS : 0;
        // Schedule next frame NOW (before any early returns)
        // Use setTimeout for idle mode to avoid unnecessary rAF calls
        if (this.isIdle && this.frameInterval > 0) {
            this.idleTimeoutId = setTimeout(() => this.animate(), this.frameInterval);
        }
        else {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
        const elapsed = now - this.lastFrameTime;
        const shouldUpdate = this.frameInterval === 0 || elapsed >= this.frameInterval;
        if (shouldUpdate) {
            this.lastFrameTime = this.frameInterval === 0 ? now : now - (elapsed % this.frameInterval);
        }
        const deltaTime = this.clock.getDelta();
        // ALWAYS update controls for smooth interaction (critical for responsiveness)
        const activeControlKey = this.cameraManager.activeControlKey;
        if (activeControlKey) {
            const controls = this.cameraManager.controls.get(activeControlKey);
            if (controls) {
                if (activeControlKey.includes("creative")) {
                    // Update creative controls
                    const speed = new THREE.Vector3(200, 200, 200);
                    CreativeControls.update(controls, speed);
                }
                else if (controls.update) {
                    // Update OrbitControls or other controls that have an update method
                    controls.update();
                }
            }
        }
        // Update keyboard controls (WASD movement while right-clicking)
        if (this.keyboardControls) {
            this.keyboardControls.update(deltaTime);
        }
        // Debug logging every 2 seconds
        this.frameCount++;
        if (now - this.lastDebugTime > 2000) {
            const actualFPS = this.frameCount / ((now - this.lastDebugTime) / 1000);
            this.fps = actualFPS;
            const renderFPS = (this.frameCount - this.throttledFrames) / ((now - this.lastDebugTime) / 1000);
            const mode = this.enableAdaptiveFPS ? (this.isIdle ? "idle" : "active") : "fixed";
            const fpsTarget = currentTargetFPS === 0 ? "uncapped" : `${currentTargetFPS}`;
            if (this.options.logFPS) {
                console.log(`[Renderer] FPS: ${actualFPS.toFixed(1)} (${renderFPS.toFixed(1)} rendered, ${this.throttledFrames} throttled) | Mode: ${mode} (target: ${fpsTarget}) | Controls: ${activeControlKey || "none"}`);
            }
            this.frameCount = 0;
            this.throttledFrames = 0;
            this.lastDebugTime = now;
        }
        // Early exit if we're throttling this frame
        // Controls are updated above, but we skip expensive operations and rendering
        if (!shouldUpdate) {
            this.throttledFrames++;
            return;
        }
        // Rest of your existing updates (only when not throttled)
        if (!this.highlightManager)
            return;
        if (!this.renderManager)
            return;
        this.highlightManager.update(deltaTime);
        this.gizmoManager?.update();
        this.renderManager.render();
        this.interactionManager?.update();
        this.cubane.updateAnimations();
    }
    // Schematic rendering bounds management
    /**
     * Gets the rendering bounds for a schematic
     * @param schematicId ID of the schematic
     * @param asArrays If true, returns min/max as arrays instead of Vector3s
     * @returns The rendering bounds or null if schematic not found
     */
    getRenderingBounds(schematicId, asArrays = true) {
        const schematic = this.schematicManager?.getSchematic(schematicId);
        if (!schematic) {
            console.error(`Schematic with ID ${schematicId} not found`);
            return null;
        }
        if (asArrays) {
            return {
                min: schematic.renderingBounds.min.toArray(),
                max: schematic.renderingBounds.max.toArray(),
            };
        }
        else {
            return {
                min: schematic.renderingBounds.min.clone(),
                max: schematic.renderingBounds.max.clone(),
            };
        }
    }
    /**
     * Sets the rendering bounds for a schematic and enables them
     * @param schematicId ID of the schematic
     * @param min Minimum coordinates (Vector3 or array [x,y,z])
     * @param max Maximum coordinates (Vector3 or array [x,y,z])
     * @param showHelper Whether to show a visual helper for the bounds
     */
    setRenderingBounds(schematicId, min, max, showHelper = true) {
        const schematic = this.schematicManager?.getSchematic(schematicId);
        if (!schematic) {
            console.error(`Schematic with ID ${schematicId} not found`);
            return;
        }
        schematic.setRenderingBounds(min, max, showHelper);
        // Enable the bounds when explicitly set
        schematic.renderingBounds.enabled = true;
    }
    /**
     * Sets a specific axis of the rendering bounds
     * @param schematicId ID of the schematic
     * @param axis The axis to set ('x', 'y', or 'z')
     * @param minValue Minimum value for the axis
     * @param maxValue Maximum value for the axis
     */
    setRenderingBoundsAxis(schematicId, axis, minValue, maxValue) {
        const schematic = this.schematicManager?.getSchematic(schematicId);
        if (!schematic) {
            console.error(`Schematic with ID ${schematicId} not found`);
            return;
        }
        const bounds = this.getRenderingBounds(schematicId, false);
        if (!bounds)
            return;
        const min = bounds.min;
        const max = bounds.max;
        // Update just the specified axis
        min[axis] = minValue;
        max[axis] = maxValue;
        schematic.setRenderingBounds(min, max);
    }
    /**
     * Resets the rendering bounds to include the full schematic or disables them
     * @param schematicId ID of the schematic
     * @param disable Whether to disable the rendering bounds (default: true)
     */
    resetRenderingBounds(schematicId, disable = true) {
        const schematic = this.schematicManager?.getSchematic(schematicId);
        if (!schematic) {
            console.error(`Schematic with ID ${schematicId} not found`);
            return;
        }
        schematic.resetRenderingBounds();
        // By default, disable the bounds when reset
        schematic.renderingBounds.enabled = !disable;
    }
    /**
     * Shows or hides the rendering bounds helper
     * @param schematicId ID of the schematic
     * @param visible Whether the helper should be visible
     */
    showRenderingBoundsHelper(schematicId, visible) {
        const schematic = this.schematicManager?.getSchematic(schematicId);
        if (!schematic) {
            console.error(`Schematic with ID ${schematicId} not found`);
            return;
        }
        schematic.showRenderingBoundsHelper(visible);
    }
    /**
     * Gets the dimensions of a schematic
     * @param schematicId ID of the schematic
     * @returns The dimensions as an array [width, height, depth] or null if schematic not found
     */
    getSchematicDimensions(schematicId) {
        const schematic = this.schematicManager?.getSchematic(schematicId);
        if (!schematic) {
            console.error(`Schematic with ID ${schematicId} not found`);
            return null;
        }
        return Array.from(schematic.schematicWrapper.get_dimensions());
    }
    /**
     * Gets all currently loaded schematics
     * @returns Array of schematic IDs
     */
    getLoadedSchematics() {
        if (!this.schematicManager)
            return [];
        return this.schematicManager.getAllSchematics().map((schematic) => schematic.id);
    }
    /**
     * Creates console-friendly settings for working with rendering bounds
     * Delegates to the SchematicObject's createBoundsControls method
     * @param schematicId ID of the schematic
     * @returns Functions for easy console usage
     */
    createBoundsControls(schematicId) {
        const schematic = this.schematicManager?.getSchematic(schematicId);
        if (!schematic) {
            console.error(`Schematic with ID ${schematicId} not found`);
            return null;
        }
        return schematic.createBoundsControls();
    }
    /**
     * Provides direct access to a schematic's bounds for easy manipulation
     * @param schematicId ID of the schematic
     * @returns The schematic's reactive bounds object or null if not found
     */
    getBounds(schematicId) {
        const schematic = this.schematicManager?.getSchematic(schematicId);
        if (!schematic) {
            console.error(`Schematic with ID ${schematicId} not found`);
            return null;
        }
        return schematic.bounds;
    }
    // Resource pack management methods
    async getResourcePacks() {
        await this.resourcePackManager.initPromise;
        return await this.resourcePackManager.listPacks();
    }
    async addResourcePack(file) {
        // Show progress for resource pack upload
        if (this.options.enableProgressBar && this.uiManager) {
            this.uiManager.showProgressBar(`Adding resource pack: ${file.name}`);
            this.uiManager.updateProgress(0.1, "Processing pack file...");
        }
        // Add to your existing system
        await this.resourcePackManager.uploadPack(file);
        if (this.options.enableProgressBar && this.uiManager) {
            this.uiManager.updateProgress(0.3, "Loading into Cubane...");
        }
        // Also load directly into Cubane for immediate use
        try {
            await this.cubane.loadResourcePack(file);
            await this.cubane.getAssetLoader().buildTextureAtlas?.();
        }
        catch (error) {
            console.error("Failed to load new resource pack into Cubane:", error);
        }
        if (this.options.enableProgressBar && this.uiManager) {
            this.uiManager.updateProgress(0.6, "Rebuilding meshes...");
        }
        // Rebuild world meshes if needed
        if (this.worldMeshBuilder && this.schematicManager) {
            // for (const schematic of this.schematicManager.getAllSchematics()) {
            // 	await this.worldMeshBuilder.rebuildSchematic(schematic.id);
            // }
        }
        if (this.options.enableProgressBar && this.uiManager) {
            this.uiManager.updateProgress(1.0, "Resource pack added");
            setTimeout(() => this.uiManager?.hideProgressBar(), 500);
        }
    }
    async toggleResourcePackEnabled(name, enabled) {
        // Show progress for resource pack toggling
        if (this.options.enableProgressBar && this.uiManager) {
            const actionText = enabled ? "Enabling" : "Disabling";
            this.uiManager.showProgressBar(`${actionText} resource pack: ${name}`);
            this.uiManager.updateProgress(0.2, `${actionText} ${name}...`);
        }
        await this.resourcePackManager.togglePackEnabled(name, enabled);
        await this.reloadResources();
    }
    async removeResourcePack(name) {
        // Show progress for resource pack removal
        if (this.options.enableProgressBar && this.uiManager) {
            this.uiManager.showProgressBar(`Removing resource pack: ${name}`);
            this.uiManager.updateProgress(0.2, `Removing ${name}...`);
        }
        await this.resourcePackManager.removePack(name);
        await this.reloadResources();
    }
    async reloadResources() {
        // Show progress bar for resource reload
        if (this.options.enableProgressBar && this.uiManager) {
            this.uiManager.showProgressBar("Reloading resources...");
            this.uiManager.updateProgress(0.2, "Processing resource packs...");
        }
        // Clear Cubane's existing resources
        this.cubane.dispose();
        this.cubane = new Cubane(); // Recreate fresh instance
        // Reinitialize resource packs in Cubane
        await this.initializeResourcePacks();
        if (this.options.enableProgressBar && this.uiManager) {
            this.uiManager.updateProgress(0.5, "Loading textures and models...");
        }
        // Rebuild world meshes with new resources
        if (this.worldMeshBuilder && this.schematicManager) {
            this.uiManager?.updateProgress(0.7, "Rebuilding schematic meshes...");
            // Trigger rebuild of all schematic meshes
            // for (const schematic of this.schematicManager.getAllSchematics()) {
            // 	await this.worldMeshBuilder.rebuildSchematic(schematic.id);
            // }
        }
        if (this.options.enableProgressBar && this.uiManager) {
            this.uiManager.updateProgress(1.0, "Resources loaded");
            // Hide progress bar after a short delay
            setTimeout(() => {
                this.uiManager?.hideProgressBar();
            }, 500);
        }
        this.materialMap.clear();
    }
    /**
     * Shows the performance dashboard UI
     */
    showPerformanceDashboard() {
        performanceDashboard.show();
    }
    /**
     * Hides the performance dashboard UI
     */
    hidePerformanceDashboard() {
        performanceDashboard.hide();
    }
    /**
     * Toggles the performance dashboard UI
     */
    togglePerformanceDashboard() {
        performanceDashboard.toggle();
    }
    /**
     * Set SSAO preset for a specific camera mode
     * @param mode Camera mode ('perspective' or 'isometric')
     * @param params SSAO parameters
     */
    setSSAOPreset(mode, params) {
        if (this.renderManager) {
            this.renderManager.setSSAOPreset(mode, params);
        }
    }
    /**
     * Get current SSAO presets
     */
    getSSAOPresets() {
        return this.renderManager?.getSSAOPresets() ?? null;
    }
    /**
     * Set SSAO parameters for the current camera mode
     * @param params SSAO parameters
     */
    setSSAOParameters(params) {
        if (this.renderManager) {
            this.renderManager.setSSAOParameters(params);
        }
    }
    /**
     * Set custom isometric viewing angles
     * @param pitchDegrees Vertical angle in degrees (0-90, default ~35.264 for true isometric)
     * @param yawDegrees Horizontal rotation in degrees (default 45)
     * @param refocus Whether to refocus on schematics after changing angles (default true)
     */
    setIsometricAngles(pitchDegrees, yawDegrees = 45, refocus = true) {
        this.cameraManager.setIsometricAngles(pitchDegrees, yawDegrees, refocus);
    }
    /**
     * Reset isometric angles to true isometric view
     * @param refocus Whether to refocus on schematics (default true)
     */
    resetIsometricAngles(refocus = true) {
        this.cameraManager.resetIsometricAngles(refocus);
    }
    /**
     * Get current isometric viewing angles
     * @returns Object with pitch and yaw in degrees, or null if not in isometric mode
     */
    getIsometricAngles() {
        return this.cameraManager.getIsometricAngles();
    }
    /**
     * Initializes simulation for the first schematic
     */
    async initializeSimulation() {
        if (!this.simulationManager) {
            console.warn("Simulation is not enabled");
            return false;
        }
        const firstSchematic = this.schematicManager?.getFirstSchematic();
        if (!firstSchematic) {
            console.warn("No schematic loaded to simulate");
            return false;
        }
        const schematic = firstSchematic.getSchematicWrapper();
        if (!schematic) {
            console.warn("Could not get schematic wrapper");
            return false;
        }
        return await this.simulationManager.initializeSimulation(schematic);
    }
    /**
     * Manually ticks the simulation
     * @param numTicks Number of ticks to advance (default: 1)
     */
    tickSimulation(numTicks = 1) {
        this.simulationManager?.tick(numTicks);
    }
    /**
     * Syncs simulation state back to schematic and rebuilds meshes
     */
    async syncSimulation() {
        const updatedSchematic = this.simulationManager?.syncToSchematic();
        if (updatedSchematic) {
            // Update the schematic wrapper and rebuild mesh
            const firstSchematic = this.schematicManager?.getFirstSchematic();
            if (firstSchematic) {
                firstSchematic.schematicWrapper = updatedSchematic;
                await firstSchematic.rebuildMesh();
            }
            else {
                console.error("[syncSimulation] No first schematic found!");
            }
        }
        else {
            console.error("[syncSimulation] No updated schematic returned from sync!");
        }
    }
    /**
     * Starts auto-ticking the simulation
     */
    startAutoTick() {
        this.simulationManager?.startAutoTick();
    }
    /**
     * Stops auto-ticking the simulation
     */
    stopAutoTick() {
        this.simulationManager?.stopAutoTick();
    }
    /**
     * Resets the simulation
     */
    async resetSimulation() {
        if (!this.simulationManager)
            return false;
        this.simulationManager.reset();
        this.rebuildAllChunks();
        return true;
    }
    /**
     * Gets the current simulation state
     */
    getSimulationState() {
        return this.simulationManager?.getState();
    }
    /**
     * Rebuilds all chunks in all schematics
     */
    rebuildAllChunks() {
        const schematics = this.schematicManager?.getAllSchematics();
        if (!schematics)
            return;
        for (const schematic of schematics) {
            schematic.rebuildAllChunks();
        }
    }
    // ===== CAPTURE API =====
    /**
     * Take a screenshot of the current view
     * @param options Screenshot options (width, height, quality, format)
     * @returns Promise<Blob> The screenshot as a Blob
     */
    async takeScreenshot(options) {
        return this.cameraManager.recordingManager.takeScreenshot(options);
    }
    /**
     * Take a screenshot and automatically download it
     * @param filename Filename (without extension)
     * @param options Screenshot options
     */
    async downloadScreenshot(filename = "schematic_screenshot", options) {
        const format = options?.format ?? "image/png";
        const blob = await this.takeScreenshot(options);
        const extension = format === "image/png" ? "png" : "jpg";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    /**
     * Start video recording along the camera path
     * @param duration Duration in seconds
     * @param options Recording options
     */
    async startRecording(duration, options) {
        return this.cameraManager.recordingManager.startRecording(duration, options);
    }
    /**
     * Stop the current recording
     */
    stopRecording() {
        this.cameraManager.recordingManager.stopRecording();
    }
    /**
     * Check if currently recording
     */
    isRecording() {
        return this.cameraManager.recordingManager.isRecording;
    }
    // ===== RENDER SETTINGS API =====
    /**
     * Set the background color (for non-HDRI backgrounds)
     * @param color Color as hex string (e.g., "#87ceeb") or number (e.g., 0x87ceeb)
     */
    setBackgroundColor(color) {
        this.sceneManager.setBackgroundColor(color);
        this.renderManager?.setIsometricBackgroundColor(color);
    }
    /**
     * Set camera mode (perspective, isometric, or first-person)
     * @param mode Camera mode
     */
    setCameraMode(mode) {
        this.cameraManager.switchCameraPreset(mode);
    }
    /**
     * Get current camera mode
     */
    getCameraMode() {
        return this.cameraManager.activeCameraKey;
    }
    /**
     * Enable or disable SSAO (ambient occlusion)
     * @param enabled Whether SSAO should be enabled
     */
    setSSAOEnabled(enabled) {
        this.renderManager?.setSSAOEnabled(enabled);
    }
    /**
     * Check if SSAO is enabled
     */
    isSSAOEnabled() {
        return this.renderManager?.isSSAOEnabled() ?? false;
    }
    /**
     * Enable or disable the grid helper
     * @param visible Whether the grid should be visible
     */
    setGridVisible(visible) {
        this.sceneManager.showGrid = visible;
    }
    /**
     * Enable or disable the axes helper
     * @param visible Whether the axes should be visible
     */
    setAxesVisible(visible) {
        this.sceneManager.showAxes = visible;
    }
    // ===== CAMERA PATH API =====
    /**
     * Show or hide the camera path visualization
     * @param visible Whether the path should be visible
     * @param pathName Name of the path (default: "circularPath")
     */
    setCameraPathVisible(visible, pathName = "circularPath") {
        if (visible) {
            this.cameraManager.showPathVisualization(pathName);
        }
        else {
            this.cameraManager.hidePathVisualization(pathName);
        }
    }
    /**
     * Fit the camera path to frame all loaded schematics
     * @param pathName Name of the path (default: "circularPath")
     */
    fitCameraPath(pathName = "circularPath") {
        this.cameraManager.cameraPathManager.fitCircularPathToSchematics(pathName);
    }
    /**
     * Animate the camera along a path (for previews or recordings)
     * @param options Animation options
     */
    async animateCameraAlongPath(options) {
        return this.cameraManager.animateCameraAlongPath(options);
    }
    // ===== UI VISIBILITY API =====
    /**
     * Show the render settings UI panel
     */
    showRenderSettings() {
        this.renderSettingsUI?.show();
    }
    /**
     * Hide the render settings UI panel
     */
    hideRenderSettings() {
        this.renderSettingsUI?.hide();
    }
    /**
     * Toggle the render settings UI panel
     */
    toggleRenderSettings() {
        this.renderSettingsUI?.toggle();
    }
    /**
     * Show the capture UI panel
     */
    showCaptureUI() {
        this.captureUI?.show();
    }
    /**
     * Hide the capture UI panel
     */
    hideCaptureUI() {
        this.captureUI?.hide();
    }
    /**
     * Toggle the capture UI panel
     */
    toggleCaptureUI() {
        this.captureUI?.toggle();
    }
    /**
     * Show the export UI panel
     */
    showExportUI() {
        this.exportUI?.show();
    }
    /**
     * Hide the export UI panel
     */
    hideExportUI() {
        this.exportUI?.hide();
    }
    /**
     * Toggle the export UI panel
     */
    toggleExportUI() {
        this.exportUI?.toggle();
    }
    /**
     * Show the resource pack UI panel
     */
    showResourcePackUI() {
        this.resourcePackUI?.show();
    }
    /**
     * Hide the resource pack UI panel
     */
    hideResourcePackUI() {
        this.resourcePackUI?.hide();
    }
    /**
     * Toggle the resource pack UI panel
     */
    toggleResourcePackUI() {
        this.resourcePackUI?.toggle();
    }
    /**
     * Get all available UI panels
     */
    getUIState() {
        return {
            renderSettings: this.renderSettingsUI?.isShowing() ?? false,
            capture: this.captureUI?.isShowing() ?? false,
            export: this.exportUI?.isShowing() ?? false,
            resourcePack: this.resourcePackUI?.isShowing() ?? false,
            performanceDashboard: performanceDashboard.isShowing(),
        };
    }
    dispose() {
        // Mark as disposed to stop animation loop
        this.isDisposed = true;
        // Cancel the animation frame/timeout to stop the loop immediately
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        // Cancel idle timeout if active
        if (this.idleTimeoutId !== null) {
            clearTimeout(this.idleTimeoutId);
            this.idleTimeoutId = null;
        }
        // Unbind pointer events
        this.unbindPointerEvents();
        // Dispose keyboard controls
        if (this.keyboardControls) {
            this.keyboardControls.dispose();
            this.keyboardControls = undefined;
        }
        // Dispose inspector
        if (this.inspectorManager) {
            this.inspectorManager.dispose();
            this.inspectorManager = undefined;
        }
        if (this.regionManager) {
            this.regionManager.dispose();
            this.regionManager = undefined;
        }
        if (this.regionInteractionHandler) {
            this.regionInteractionHandler.dispose();
            this.regionInteractionHandler = undefined;
        }
        if (!this.renderManager) {
            return;
        }
        if (!this.highlightManager) {
            return;
        }
        if (!this.uiManager) {
            return;
        }
        this.highlightManager.dispose();
        this.renderManager.renderer.dispose();
        this.dragAndDropManager?.dispose();
        this.uiManager.dispose();
        this.cameraManager.dispose();
        // Clean up resource pack UI
        this.resourcePackUI?.dispose();
        // Clean up export UI
        this.exportUI?.dispose();
        // Clean up render settings UI
        this.renderSettingsUI?.dispose();
        // Clean up capture UI
        this.captureUI?.dispose();
        // Clean up resource pack manager
        this.resourcePackManager.dispose();
        // Clean up Cubane resources
        this.cubane.dispose();
        // Cleanup event listeners
        this.eventEmitter.removeAllListeners();
    }
}
Object.defineProperty(SchematicRenderer, "isNucleationInitialized", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
