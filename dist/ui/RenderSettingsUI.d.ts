import { SchematicRenderer } from "../SchematicRenderer";
import { BaseUI, BaseUIOptions } from "./UIComponents";
export interface RenderSettingsUIOptions extends BaseUIOptions {
    /** Initial values for render settings */
    defaultSettings?: Partial<RenderSettings>;
    /** Callback when settings change */
    onSettingsChange?: (settings: RenderSettings) => void;
}
export interface RenderSettings {
    hdriEnabled: boolean;
    backgroundColor: string;
    cameraMode: "perspective" | "isometric" | "perspective_fpv";
    isometricPitch: number;
    isometricYaw: number;
    ssaoEnabled: boolean;
    ssaoIntensity: number;
    ssaoRadius: number;
    smaaEnabled: boolean;
    gammaEnabled: boolean;
    gammaValue: number;
    showGrid: boolean;
    showAxes: boolean;
    ambientLightIntensity: number;
    directionalLightIntensity: number;
    autoOrbitEnabled: boolean;
    autoOrbitDuration: number;
}
/**
 * Render Settings UI Component
 * Provides a visual interface for tweaking render settings like HDRI, background color,
 * camera modes, post-processing effects, and scene helpers.
 */
export declare class RenderSettingsUI extends BaseUI {
    private renderer;
    private settings;
    private onSettingsChange?;
    private cameraModeSelect;
    private isometricControls;
    private hdriToggle;
    private ssaoToggle;
    private autoOrbitToggle;
    constructor(renderer: SchematicRenderer, options?: RenderSettingsUIOptions);
    private initializeSettingsFromRenderer;
    private buildUI;
    private createBackgroundSection;
    private createCameraSection;
    private createPostProcessingSection;
    private createSceneSection;
    private createLightingSection;
    private createFooter;
    private updateIsometricControlsVisibility;
    private applyHDRISetting;
    private applyBackgroundColor;
    private applyCameraMode;
    private applyIsometricAngles;
    private applyLightIntensity;
    private resetToDefaults;
    private applyAllSettings;
    private updateUIFromSettings;
    private subscribeToEvents;
    private emitChange;
    /**
     * Get current render settings
     */
    getSettings(): RenderSettings;
    /**
     * Update settings programmatically
     */
    setSettings(settings: Partial<RenderSettings>): void;
    /**
     * Set camera mode
     */
    setCameraMode(mode: RenderSettings["cameraMode"]): void;
    /**
     * Set isometric angles
     */
    setIsometricAngles(pitch: number, yaw: number): void;
    /**
     * Enable/disable SSAO
     */
    setSSAOEnabled(enabled: boolean): void;
    /**
     * Set background color
     */
    setBackgroundColor(color: string): void;
    /**
     * Toggle HDRI
     */
    setHDRIEnabled(enabled: boolean): void;
    /**
     * Set auto-orbit
     */
    setAutoOrbit(enabled: boolean, duration?: number): void;
}
//# sourceMappingURL=RenderSettingsUI.d.ts.map