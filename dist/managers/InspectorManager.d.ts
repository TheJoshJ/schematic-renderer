/**
 * InspectorManager
 *
 * Provides a debug GUI panel using lil-gui for inspecting and tweaking
 * the SchematicRenderer in real-time. This is a first-class citizen of
 * the renderer that can be enabled via options.
 *
 * When WebGPU mode is active, also integrates the Three.js Inspector
 * for GPU profiling and debugging.
 */
import type { SchematicRenderer } from "../SchematicRenderer";
import type { DebugOptions } from "../SchematicRendererOptions";
export interface InspectorPanel {
    name: string;
    folder: any;
}
export declare class InspectorManager {
    private renderer;
    private gui;
    private options;
    private panels;
    private isVisible;
    private state;
    private threeInspector;
    private toggleShortcut;
    private keydownHandler;
    constructor(renderer: SchematicRenderer, options?: DebugOptions);
    private initialize;
    /**
     * Setup Three.js Inspector when in WebGPU mode
     * The Inspector provides GPU profiling and debugging capabilities
     */
    private setupThreeInspector;
    /**
     * Get the Three.js Inspector instance (WebGPU only)
     */
    getThreeInspector(): any;
    /**
     * Check if Three.js Inspector is available
     */
    hasThreeInspector(): boolean;
    private initializeState;
    private addRendererPanel;
    private addScenePanel;
    private addCameraPanel;
    private addPerformancePanel;
    private addGPUPanel;
    /**
     * Add a custom panel with controls
     */
    private addCustomPanel;
    /**
     * Add a folder to the GUI programmatically
     */
    addFolder(name: string): any | null;
    /**
     * Get a folder by name
     */
    getFolder(name: string): any | null;
    /**
     * Get the main GUI instance
     */
    getGUI(): any | null;
    private setWireframeMode;
    private takeScreenshot;
    private setupKeyboardShortcut;
    /**
     * Show the inspector GUI
     */
    show(): void;
    /**
     * Hide the inspector GUI
     */
    hide(): void;
    /**
     * Toggle the inspector GUI visibility
     */
    toggle(): void;
    /**
     * Check if inspector is visible
     */
    get visible(): boolean;
    /**
     * Dispose of the inspector
     */
    dispose(): void;
}
//# sourceMappingURL=InspectorManager.d.ts.map