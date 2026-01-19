import { InteractionManagerOptions } from "./managers/InteractionManager";
import { DragAndDropManagerOptions } from "./managers/DragAndDropManager";
import { GizmoManagerOptions } from "./managers/GizmoManager";
import { CameraManagerOptions } from "./managers/CameraManager";
import { SelectableObject } from "./managers/SelectableObject";
import { SchematicRenderer } from "./SchematicRenderer";
import { ResourcePackOptions } from "./types/resourcePack";
import { ExportUIOptions } from "./types/export";
import { CaptureUIOptions } from "./ui/CaptureUI";
import { RenderSettingsUIOptions } from "./ui/RenderSettingsUI";
import { KeyboardShortcut } from "./ui/UIComponents";
export interface ProgressBarOptions {
    showLabel?: boolean;
    showPercentage?: boolean;
    barColor?: string;
    barHeight?: number;
    labelColor?: string;
    labelSize?: string;
    theme?: "light" | "dark" | "custom";
}
export interface SimulationOptions {
    enableSimulation?: boolean;
    autoTickSpeed?: number;
    autoInitialize?: boolean;
    autoSync?: boolean;
}
export interface KeyboardControlsOptions {
    enabled?: boolean;
    flySpeed?: number;
    sprintMultiplier?: number;
    keybinds?: {
        forward?: string;
        backward?: string;
        left?: string;
        right?: string;
        up?: string;
        down?: string;
        sprint?: string;
    };
}
export interface DebugOptions {
    enableInspector?: boolean;
    showOnStartup?: boolean;
    enableKeyboardShortcuts?: boolean;
    toggleInspectorShortcut?: KeyboardShortcut;
    customPanels?: Array<{
        name: string;
        controls: Array<{
            name: string;
            type: "number" | "boolean" | "color" | "button" | "select";
            value?: any;
            min?: number;
            max?: number;
            step?: number;
            options?: string[] | Record<string, any>;
            onChange?: (value: any) => void;
        }>;
    }>;
}
export interface PerformanceDashboardOptions {
    enabled?: boolean;
    enableKeyboardShortcuts?: boolean;
    toggleDashboardShortcut?: KeyboardShortcut;
}
export interface PostProcessingOptions {
    enabled?: boolean;
    enableSSAO?: boolean;
    enableSMAA?: boolean;
    enableGamma?: boolean;
    ssaoPresets?: {
        perspective?: {
            aoRadius?: number;
            distanceFalloff?: number;
            intensity?: number;
        };
        isometric?: {
            aoRadius?: number;
            distanceFalloff?: number;
            intensity?: number;
        };
    };
}
export interface DefinitionRegionOptions {
    /**
     * Automatically show definition regions from schematic metadata when a schematic is loaded.
     * Definition regions are regions stored in the schematic's NucleationDefinitions metadata,
     * typically created via the CircuitBuilder or Insign APIs.
     *
     * @default true
     */
    showOnLoad?: boolean;
    /**
     * Default color for definition regions (hex).
     * Individual regions may override this if they have color metadata.
     *
     * @default 0x00ff88 (green)
     */
    defaultColor?: number;
    /**
     * Default opacity for definition regions.
     *
     * @default 0.25
     */
    defaultOpacity?: number;
    /**
     * Show wireframe edges around regions
     *
     * @default true
     */
    showEdges?: boolean;
    /**
     * Show labels with region names
     *
     * @default true
     */
    showLabels?: boolean;
}
export interface GPUComputeOptions {
    /**
     * Enable WebGPU compute for mesh building
     *
     * ⚠️ WARNING: GPU compute is currently SLOWER than workers due to GPU→CPU
     * readback overhead (~6x slower, ~10x more memory). Additionally, textures
     * don't render correctly (wireframe only).
     *
     * The Web Worker path with WASM is the recommended and default approach.
     * Keep this disabled unless you're developing/testing the GPU path.
     *
     * @default false
     * @deprecated Use default worker path instead
     */
    enabled?: boolean;
    /** @deprecated GPU compute is not recommended */
    preferGPU?: boolean;
}
export interface WasmMeshBuilderOptions {
    /**
     * Use WASM-based mesh builder for high-performance geometry merging.
     *
     * The WASM mesh builder is written in Rust and provides significantly
     * better performance than the pure JavaScript implementation for the
     * geometry merging and face culling operations.
     *
     * @default true (recommended)
     */
    enabled?: boolean;
    /**
     * Enable greedy meshing optimization.
     *
     * Greedy meshing merges adjacent coplanar faces with the same material
     * into larger quads, dramatically reducing vertex count (5-10x reduction)
     * for large flat surfaces like walls and floors.
     *
     * This improves both mesh building time and runtime rendering performance.
     *
     * Note: Only works when WASM mesh builder is enabled.
     *
     * @default false (until fully tested)
     */
    greedyMeshingEnabled?: boolean;
    /**
     * Maximum number of worker threads to use for mesh building.
     *
     * For small schematics, fewer workers (2-4) can actually be faster due to
     * reduced initialization overhead. For large schematics, more workers help.
     *
     * Set to 0 to use automatic detection (capped at 8).
     *
     * @default 0 (automatic - uses min(hardwareConcurrency, 8))
     */
    maxWorkers?: number;
}
export interface WebGPURendererOptions {
    /**
     * Prefer WebGPU renderer when available.
     *
     * When enabled, the renderer will attempt to use WebGPURenderer if the
     * browser supports WebGPU. Falls back to WebGLRenderer automatically
     * if WebGPU is not available.
     *
     * Benefits of WebGPU:
     * - Access to Three.js Inspector for debugging
     * - Better performance for compute-heavy operations
     * - Modern GPU API with better parallelism
     *
     * Requirements:
     * - Chrome 113+, Edge 113+, Safari 17+, Firefox (behind flag)
     *
     * @default false (WebGL is more widely supported)
     */
    preferWebGPU?: boolean;
    /**
     * Force WebGPU renderer even if feature detection suggests it may not work well.
     * Use this for testing purposes only.
     *
     * @default false
     */
    forceWebGPU?: boolean;
}
export interface SchematicRendererOptions {
    backgroundColor?: number | string;
    hdri?: string;
    resourcePackBlobs?: Blob[];
    ffmpeg?: any;
    gamma?: number;
    chunkSideLength?: number;
    meshBuildingMode?: "immediate" | "incremental" | "instanced" | "batched";
    enableInteraction?: boolean;
    enableDragAndDrop?: boolean;
    enableGizmos?: boolean;
    showGrid?: boolean;
    showAxes?: boolean;
    showCameraPathVisualization?: boolean;
    showRenderingBoundsHelper?: boolean;
    enableAutoOrbit?: boolean;
    autoOrbitDuration?: number;
    singleSchematicMode?: boolean;
    enableProgressBar?: boolean;
    progressBarOptions?: ProgressBarOptions;
    targetFPS?: number;
    idleFPS?: number;
    enableAdaptiveFPS?: boolean;
    logFPS?: boolean;
    idleThreshold?: number;
    interactionOptions?: InteractionManagerOptions;
    dragAndDropOptions?: DragAndDropManagerOptions;
    gizmoOptions?: GizmoManagerOptions;
    cameraOptions?: CameraManagerOptions;
    simulationOptions?: SimulationOptions;
    keyboardControlsOptions?: KeyboardControlsOptions;
    debugOptions?: DebugOptions;
    postProcessingOptions?: PostProcessingOptions;
    gpuComputeOptions?: GPUComputeOptions;
    wasmMeshBuilderOptions?: WasmMeshBuilderOptions;
    webgpuOptions?: WebGPURendererOptions;
    definitionRegionOptions?: DefinitionRegionOptions;
    resourcePackOptions?: ResourcePackOptions;
    exportUIOptions?: ExportUIOptions;
    captureUIOptions?: CaptureUIOptions;
    renderSettingsUIOptions?: RenderSettingsUIOptions;
    performanceDashboardOptions?: PerformanceDashboardOptions;
    callbacks?: Callbacks;
}
export declare const DEFAULT_OPTIONS: SchematicRendererOptions;
export interface Callbacks {
    onRendererInitialized?: (renderer: SchematicRenderer) => void;
    onSchematicRendered?: (schematicName: string) => void;
    onSchematicLoaded?: (schematicName: string) => void;
    onSchematicDropped?: (file: File) => void | Promise<void>;
    onSchematicDropSuccess?: (file: File) => void | Promise<void>;
    onSchematicDropFailed?: (file: File, error: Error) => void | Promise<void>;
    onSchematicFileLoaded?: (file: File) => void | Promise<void>;
    onSchematicFileLoadFailure?: (file: File) => void | Promise<void>;
    onResourcePackLoaded?: (packName: string) => void | Promise<void>;
    onResourcePackDropped?: (file: File) => void | Promise<void>;
    onResourcePackDropSuccess?: (file: File) => void | Promise<void>;
    onResourcePackDropFailed?: (file: File, error: Error) => void | Promise<void>;
    /** Called when any pack change occurs that affects rendering */
    onPacksChanged?: (reason: string) => void | Promise<void>;
    /** Called when atlas is rebuilt */
    onAtlasRebuilt?: (textureCount: number) => void | Promise<void>;
    /** Called when pack order changes */
    onPackOrderChanged?: (packIds: string[]) => void | Promise<void>;
    /** Called when a pack is toggled */
    onPackToggled?: (packId: string, enabled: boolean) => void | Promise<void>;
    onObjectSelected?: (object: SelectableObject) => void;
    onObjectDeselected?: (object: SelectableObject) => void;
    onInvalidFileType?: (file: File) => void | Promise<void>;
    onLoadingProgress?: (file: File, progress: number) => void | Promise<void>;
    onSimulationInitialized?: (schematicName: string) => void;
    onSimulationTicked?: (tickCount: number) => void;
    onSimulationSynced?: () => void;
    onSimulationError?: (error: Error) => void;
    onBlockInteracted?: (x: number, y: number, z: number) => void;
    onRenderSettingsChanged?: (settings: any) => void;
    onScreenshotTaken?: (blob: Blob, filename: string) => void;
    onRecordingComplete?: (blob: Blob, filename: string) => void;
}
//# sourceMappingURL=SchematicRendererOptions.d.ts.map