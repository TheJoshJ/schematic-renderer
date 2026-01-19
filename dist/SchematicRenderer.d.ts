import * as THREE from "three";
import { CameraManager } from "./managers/CameraManager";
import { SceneManager } from "./managers/SceneManager";
import { RenderManager } from "./managers/RenderManager";
import { DragAndDropManager } from "./managers/DragAndDropManager";
import { InteractionManager } from "./managers/InteractionManager";
import { HighlightManager } from "./managers/HighlightManager";
import { SchematicManager } from "./managers/SchematicManager";
import { WorldMeshBuilder } from "./WorldMeshBuilder";
import { EventEmitter } from "events";
import { DefaultPackCallback } from "./managers/ResourcePackManager";
import { ResourcePackManagerProxy } from "./managers/ResourcePackManagerProxy";
import { ResourcePackUI } from "./ui/ResourcePackUI";
import { ExportUI } from "./ui/ExportUI";
import { RenderSettingsUI } from "./ui/RenderSettingsUI";
import { CaptureUI } from "./ui/CaptureUI";
import { GizmoManager } from "./managers/GizmoManager";
import { SchematicRendererOptions } from "./SchematicRendererOptions";
import { UIManager } from "./managers/UIManager";
import { SimulationManager } from "./managers/SimulationManager";
import { BlockInteractionHandler } from "./managers/highlight/BlockInteractionHandler";
import { InsignManager } from "./managers/InsignManager";
import { InsignIoManager } from "./managers/InsignIoManager";
import { OverlayManager } from "./managers/OverlayManager";
import { Cubane } from "cubane";
import { KeyboardControls } from "./managers/KeyboardControls";
import { InspectorManager } from "./managers/InspectorManager";
import { RegionManager } from "./managers/RegionManager";
import { RegionInteractionHandler } from "./managers/highlight/RegionInteractionHandler";
export declare class SchematicRenderer {
    canvas: HTMLCanvasElement;
    clock: THREE.Clock;
    options: SchematicRendererOptions;
    eventEmitter: EventEmitter;
    cameraManager: CameraManager;
    sceneManager: SceneManager;
    uiManager: UIManager | undefined;
    renderManager: RenderManager | undefined;
    interactionManager: InteractionManager | undefined;
    dragAndDropManager?: DragAndDropManager;
    highlightManager: HighlightManager | undefined;
    schematicManager: SchematicManager | undefined;
    worldMeshBuilder: WorldMeshBuilder | undefined;
    gizmoManager: GizmoManager | undefined;
    simulationManager: SimulationManager | undefined;
    blockInteractionHandler: BlockInteractionHandler | undefined;
    insignManager: InsignManager | undefined;
    insignIoManager: InsignIoManager | undefined;
    regionManager: RegionManager | undefined;
    regionInteractionHandler: RegionInteractionHandler | undefined;
    overlayManager: OverlayManager | undefined;
    keyboardControls: KeyboardControls | undefined;
    inspectorManager: InspectorManager | undefined;
    materialMap: Map<string, THREE.Material>;
    timings: Map<string, number>;
    fps: number;
    private resourcePackManager;
    packs: ResourcePackManagerProxy;
    resourcePackUI: ResourcePackUI | undefined;
    exportUI: ExportUI | undefined;
    renderSettingsUI: RenderSettingsUI | undefined;
    captureUI: CaptureUI | undefined;
    cubane: Cubane;
    state: {
        cameraPosition: THREE.Vector3;
    };
    private static isNucleationInitialized;
    constructor(canvas: HTMLCanvasElement, schematicData?: {
        [key: string]: () => Promise<ArrayBuffer>;
    }, defaultResourcePacks?: Record<string, DefaultPackCallback>, options?: SchematicRendererOptions);
    updateCameraPosition(): void;
    /**
     * Sets whether auto-orbit is enabled
     * @param enabled True to enable auto-orbit, false to disable
     */
    setAutoOrbit(enabled: boolean): void;
    /**
     * Sets the duration of a full auto-orbit rotation
     * @param duration Duration in seconds
     */
    setAutoOrbitDuration(duration: number): void;
    /**
     * Toggles the auto-orbit feature
     * @returns The new state of auto-orbit (true = enabled, false = disabled)
     */
    toggleAutoOrbit(): boolean;
    /**
     * Enable or create the inspector GUI
     * Can be called at any time to show the debug panel
     */
    enableInspector(): InspectorManager;
    /**
     * Disable/hide the inspector GUI
     */
    disableInspector(): void;
    /**
     * Toggle the inspector GUI visibility
     * Creates the inspector if it doesn't exist
     */
    toggleInspector(): boolean;
    private initialize;
    private initializeInteractionComponents;
    /**
     * Set up callbacks for resource pack events
     */
    private setupResourcePackCallbacks;
    /**
     * Reload all enabled resource packs into Cubane
     * @param force - Force reload even if Cubane already has packs loaded
     */
    private reloadResourcePacksIntoCubane;
    /**
     * Rebuild all loaded schematics (e.g., after resource pack changes)
     */
    rebuildAllSchematics(): Promise<void>;
    private initializeResourcePacks;
    private lastFrameTime;
    private targetFPS;
    private idleFPS;
    private enableAdaptiveFPS;
    private idleThreshold;
    private frameInterval;
    private animationFrameId;
    private isDisposed;
    private frameCount;
    private lastDebugTime;
    private throttledFrames;
    private lastCameraPosition;
    private lastCameraQuaternion;
    private lastInteractionTime;
    private isIdle;
    private idleTimeoutId;
    private pointerEventBound;
    private wakeUpHandler;
    /**
     * Bind pointer events to canvas for immediate wake-up from idle mode
     */
    private bindPointerEvents;
    /**
     * Unbind pointer events
     */
    private unbindPointerEvents;
    private animate;
    /**
     * Gets the rendering bounds for a schematic
     * @param schematicId ID of the schematic
     * @param asArrays If true, returns min/max as arrays instead of Vector3s
     * @returns The rendering bounds or null if schematic not found
     */
    getRenderingBounds(schematicId: string, asArrays?: boolean): {
        min: THREE.Vector3 | number[];
        max: THREE.Vector3 | number[];
    } | null;
    /**
     * Sets the rendering bounds for a schematic and enables them
     * @param schematicId ID of the schematic
     * @param min Minimum coordinates (Vector3 or array [x,y,z])
     * @param max Maximum coordinates (Vector3 or array [x,y,z])
     * @param showHelper Whether to show a visual helper for the bounds
     */
    setRenderingBounds(schematicId: string, min: THREE.Vector3 | number[], max: THREE.Vector3 | number[], showHelper?: boolean): void;
    /**
     * Sets a specific axis of the rendering bounds
     * @param schematicId ID of the schematic
     * @param axis The axis to set ('x', 'y', or 'z')
     * @param minValue Minimum value for the axis
     * @param maxValue Maximum value for the axis
     */
    setRenderingBoundsAxis(schematicId: string, axis: "x" | "y" | "z", minValue: number, maxValue: number): void;
    /**
     * Resets the rendering bounds to include the full schematic or disables them
     * @param schematicId ID of the schematic
     * @param disable Whether to disable the rendering bounds (default: true)
     */
    resetRenderingBounds(schematicId: string, disable?: boolean): void;
    /**
     * Shows or hides the rendering bounds helper
     * @param schematicId ID of the schematic
     * @param visible Whether the helper should be visible
     */
    showRenderingBoundsHelper(schematicId: string, visible: boolean): void;
    /**
     * Gets the dimensions of a schematic
     * @param schematicId ID of the schematic
     * @returns The dimensions as an array [width, height, depth] or null if schematic not found
     */
    getSchematicDimensions(schematicId: string): Int32Array | number[] | null;
    /**
     * Gets all currently loaded schematics
     * @returns Array of schematic IDs
     */
    getLoadedSchematics(): string[];
    /**
     * Creates console-friendly settings for working with rendering bounds
     * Delegates to the SchematicObject's createBoundsControls method
     * @param schematicId ID of the schematic
     * @returns Functions for easy console usage
     */
    createBoundsControls(schematicId: string): any;
    /**
     * Provides direct access to a schematic's bounds for easy manipulation
     * @param schematicId ID of the schematic
     * @returns The schematic's reactive bounds object or null if not found
     */
    getBounds(schematicId: string): any;
    getResourcePacks(): Promise<Array<{
        name: string;
        enabled: boolean;
        order: number;
    }>>;
    addResourcePack(file: File): Promise<void>;
    toggleResourcePackEnabled(name: string, enabled: boolean): Promise<void>;
    removeResourcePack(name: string): Promise<void>;
    private reloadResources;
    /**
     * Shows the performance dashboard UI
     */
    showPerformanceDashboard(): void;
    /**
     * Hides the performance dashboard UI
     */
    hidePerformanceDashboard(): void;
    /**
     * Toggles the performance dashboard UI
     */
    togglePerformanceDashboard(): void;
    /**
     * Set SSAO preset for a specific camera mode
     * @param mode Camera mode ('perspective' or 'isometric')
     * @param params SSAO parameters
     */
    setSSAOPreset(mode: "perspective" | "isometric", params: {
        aoRadius?: number;
        distanceFalloff?: number;
        intensity?: number;
    }): void;
    /**
     * Get current SSAO presets
     */
    getSSAOPresets(): {
        perspective: {
            aoRadius: number;
            distanceFalloff: number;
            intensity: number;
        };
        isometric: {
            aoRadius: number;
            distanceFalloff: number;
            intensity: number;
        };
    } | null;
    /**
     * Set SSAO parameters for the current camera mode
     * @param params SSAO parameters
     */
    setSSAOParameters(params: {
        aoRadius?: number;
        distanceFalloff?: number;
        intensity?: number;
        qualityMode?: "Performance" | "Low" | "Medium" | "High" | "Ultra";
    }): void;
    /**
     * Set custom isometric viewing angles
     * @param pitchDegrees Vertical angle in degrees (0-90, default ~35.264 for true isometric)
     * @param yawDegrees Horizontal rotation in degrees (default 45)
     * @param refocus Whether to refocus on schematics after changing angles (default true)
     */
    setIsometricAngles(pitchDegrees: number, yawDegrees?: number, refocus?: boolean): void;
    /**
     * Reset isometric angles to true isometric view
     * @param refocus Whether to refocus on schematics (default true)
     */
    resetIsometricAngles(refocus?: boolean): void;
    /**
     * Get current isometric viewing angles
     * @returns Object with pitch and yaw in degrees, or null if not in isometric mode
     */
    getIsometricAngles(): {
        pitch: number;
        yaw: number;
    } | null;
    /**
     * Initializes simulation for the first schematic
     */
    initializeSimulation(): Promise<boolean>;
    /**
     * Manually ticks the simulation
     * @param numTicks Number of ticks to advance (default: 1)
     */
    tickSimulation(numTicks?: number): void;
    /**
     * Syncs simulation state back to schematic and rebuilds meshes
     */
    syncSimulation(): Promise<void>;
    /**
     * Starts auto-ticking the simulation
     */
    startAutoTick(): void;
    /**
     * Stops auto-ticking the simulation
     */
    stopAutoTick(): void;
    /**
     * Resets the simulation
     */
    resetSimulation(): Promise<boolean>;
    /**
     * Gets the current simulation state
     */
    getSimulationState(): import(".").SimulationState | undefined;
    /**
     * Rebuilds all chunks in all schematics
     */
    private rebuildAllChunks;
    /**
     * Take a screenshot of the current view
     * @param options Screenshot options (width, height, quality, format)
     * @returns Promise<Blob> The screenshot as a Blob
     */
    takeScreenshot(options?: {
        width?: number;
        height?: number;
        quality?: number;
        format?: "image/png" | "image/jpeg";
    }): Promise<Blob>;
    /**
     * Take a screenshot and automatically download it
     * @param filename Filename (without extension)
     * @param options Screenshot options
     */
    downloadScreenshot(filename?: string, options?: {
        width?: number;
        height?: number;
        quality?: number;
        format?: "image/png" | "image/jpeg";
    }): Promise<void>;
    /**
     * Start video recording along the camera path
     * @param duration Duration in seconds
     * @param options Recording options
     */
    startRecording(duration: number, options?: {
        width?: number;
        height?: number;
        frameRate?: number;
        quality?: number;
        onProgress?: (progress: number) => void;
        onComplete?: (blob: Blob) => void;
    }): Promise<void>;
    /**
     * Stop the current recording
     */
    stopRecording(): void;
    /**
     * Check if currently recording
     */
    isRecording(): boolean;
    /**
     * Set the background color (for non-HDRI backgrounds)
     * @param color Color as hex string (e.g., "#87ceeb") or number (e.g., 0x87ceeb)
     */
    setBackgroundColor(color: string | number): void;
    /**
     * Set camera mode (perspective, isometric, or first-person)
     * @param mode Camera mode
     */
    setCameraMode(mode: "perspective" | "isometric" | "perspective_fpv"): void;
    /**
     * Get current camera mode
     */
    getCameraMode(): string;
    /**
     * Enable or disable SSAO (ambient occlusion)
     * @param enabled Whether SSAO should be enabled
     */
    setSSAOEnabled(enabled: boolean): void;
    /**
     * Check if SSAO is enabled
     */
    isSSAOEnabled(): boolean;
    /**
     * Enable or disable the grid helper
     * @param visible Whether the grid should be visible
     */
    setGridVisible(visible: boolean): void;
    /**
     * Enable or disable the axes helper
     * @param visible Whether the axes should be visible
     */
    setAxesVisible(visible: boolean): void;
    /**
     * Show or hide the camera path visualization
     * @param visible Whether the path should be visible
     * @param pathName Name of the path (default: "circularPath")
     */
    setCameraPathVisible(visible: boolean, pathName?: string): void;
    /**
     * Fit the camera path to frame all loaded schematics
     * @param pathName Name of the path (default: "circularPath")
     */
    fitCameraPath(pathName?: string): void;
    /**
     * Animate the camera along a path (for previews or recordings)
     * @param options Animation options
     */
    animateCameraAlongPath(options?: {
        pathName?: string;
        totalFrames?: number;
        targetFps?: number;
        onUpdate?: (progress: number) => void;
        onComplete?: () => void;
    }): Promise<void>;
    /**
     * Show the render settings UI panel
     */
    showRenderSettings(): void;
    /**
     * Hide the render settings UI panel
     */
    hideRenderSettings(): void;
    /**
     * Toggle the render settings UI panel
     */
    toggleRenderSettings(): void;
    /**
     * Show the capture UI panel
     */
    showCaptureUI(): void;
    /**
     * Hide the capture UI panel
     */
    hideCaptureUI(): void;
    /**
     * Toggle the capture UI panel
     */
    toggleCaptureUI(): void;
    /**
     * Show the export UI panel
     */
    showExportUI(): void;
    /**
     * Hide the export UI panel
     */
    hideExportUI(): void;
    /**
     * Toggle the export UI panel
     */
    toggleExportUI(): void;
    /**
     * Show the resource pack UI panel
     */
    showResourcePackUI(): void;
    /**
     * Hide the resource pack UI panel
     */
    hideResourcePackUI(): void;
    /**
     * Toggle the resource pack UI panel
     */
    toggleResourcePackUI(): void;
    /**
     * Get all available UI panels
     */
    getUIState(): {
        renderSettings: boolean;
        capture: boolean;
        export: boolean;
        resourcePack: boolean;
        performanceDashboard: boolean;
    };
    dispose(): void;
}
//# sourceMappingURL=SchematicRenderer.d.ts.map