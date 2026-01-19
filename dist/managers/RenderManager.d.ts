import * as THREE from "three";
import { SchematicRenderer } from "../SchematicRenderer";
type AnyRenderer = THREE.WebGLRenderer | any;
export declare class RenderManager {
    private schematicRenderer;
    renderer: AnyRenderer;
    private composer;
    private _postProcessing;
    private passes;
    private eventEmitter;
    private pmremGenerator;
    private isRendering;
    private hdriPath;
    private hdriBackgroundOnly;
    private currentEnvMap;
    private disposed;
    private contextLost;
    private initialSizeSet;
    private resizeTimeout;
    private renderRequested;
    private _isWebGPU;
    private _webgpuInitialized;
    private inspector;
    private originalBackground;
    private isometricBackground;
    private ssaoPresets;
    constructor(schematicRenderer: SchematicRenderer);
    /**
     * Async initialization - must be called after constructor
     */
    initialize(): Promise<void>;
    /**
     * Check if WebGPU is supported in the current browser
     */
    private checkWebGPUSupport;
    /**
     * Check if currently using WebGPU renderer
     */
    get isWebGPU(): boolean;
    /**
     * Get the Three.js Inspector (WebGPU only)
     */
    getInspector(): any;
    /**
     * Setup simple environment lighting for WebGPU mode
     * Since HDRI/PMREMGenerator isn't compatible with WebGPU, we enhance
     * the scene lighting to compensate for the lack of environment maps.
     */
    private setupWebGPUEnvironment;
    private setInitialSize;
    /**
     * Initialize WebGPU Renderer
     */
    private initWebGPURenderer;
    /**
     * Initialize WebGL Renderer (original code)
     */
    private initWebGLRenderer;
    private initComposer;
    /**
     * Handle camera type changes to manage HDRI background and SSAO appropriately
     */
    private handleCameraChange;
    /**
     * Check if current camera is orthographic (isometric)
     */
    private isOrthographicCamera;
    setupHDRIBackground(hdriPath: string, backgroundOnly?: boolean): void;
    private isPMREMGeneratorDisposed;
    private loadHDRI;
    private loadHDRIWithCache;
    private applyHDRITexture;
    /**
     * Set the background color for isometric view
     */
    setIsometricBackgroundColor(color: THREE.ColorRepresentation): void;
    /**
     * Get the current isometric background color
     */
    getIsometricBackgroundColor(): THREE.Color;
    private handleContextLost;
    private handleContextRestored;
    private initDefaultPasses;
    private setupEventListeners;
    updateCanvasSize(): void;
    enableEffect(effectName: string): void;
    disableEffect(effectName: string): void;
    setGamma(value: number): void;
    /**
     * Enable or disable SSAO at runtime
     * Useful for auto-disabling on small schematics or performance optimization
     */
    setSSAOEnabled(enabled: boolean): void;
    /**
     * Check if SSAO is currently enabled
     */
    isSSAOEnabled(): boolean;
    setSSAOParameters(params: {
        aoRadius?: number;
        distanceFalloff?: number;
        intensity?: number;
        qualityMode?: "Performance" | "Low" | "Medium" | "High" | "Ultra";
    }): void;
    /**
     * Customize SSAO presets for different camera modes
     * @param mode - Camera mode ('perspective' or 'isometric')
     * @param params - SSAO parameters to apply for this mode
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
    };
    renderSingleFrameAndGetStats(): {
        renderTimeMs: number;
        rendererInfo: THREE.WebGLInfo | null;
    };
    render(): void;
    requestRender(): void;
    resize(width: number, height: number): void;
    updateCamera(camera: THREE.Camera): void;
    getRenderer(): AnyRenderer;
    getEffect(effectName: string): any;
    dispose(): void;
}
export {};
//# sourceMappingURL=RenderManager.d.ts.map