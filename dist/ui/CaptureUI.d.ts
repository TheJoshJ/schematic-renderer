import { SchematicRenderer } from "../SchematicRenderer";
import { BaseUI, BaseUIOptions } from "./UIComponents";
export interface CaptureUIOptions extends BaseUIOptions {
    /** Default screenshot resolution presets */
    screenshotPresets?: {
        label: string;
        width: number;
        height: number;
    }[];
    /** Default recording settings */
    defaultRecordingSettings?: Partial<RecordingSettings>;
    /** Callback when screenshot is taken */
    onScreenshotTaken?: (blob: Blob, filename: string) => void;
    /** Callback when recording completes */
    onRecordingComplete?: (blob: Blob, filename: string) => void;
}
export interface ScreenshotSettings {
    width: number;
    height: number;
    quality: number;
    format: "image/png" | "image/jpeg";
    filename: string;
}
export interface RecordingSettings {
    width: number;
    height: number;
    frameRate: number;
    duration: number;
    quality: number;
    filename: string;
}
export interface CameraPathSettings {
    visible: boolean;
    pathName: string;
    autoFit: boolean;
}
/**
 * Capture UI Component
 * Provides interface for taking high-resolution screenshots and recording videos
 * of the schematic renderer with camera path support.
 */
export declare class CaptureUI extends BaseUI {
    private renderer;
    private screenshotSettings;
    private recordingSettings;
    private cameraPathSettings;
    private screenshotPresets;
    private onScreenshotTaken?;
    private onRecordingComplete?;
    private isRecording;
    private presetSelect;
    private customWidthInput;
    private customHeightInput;
    private customSizeContainer;
    private screenshotButton;
    private recordButton;
    private recordingStatus;
    private progressBar;
    private progressText;
    private pathVisibilityToggle;
    constructor(renderer: SchematicRenderer, options?: CaptureUIOptions);
    private buildUI;
    private createScreenshotSection;
    private createCameraPathSection;
    /**
     * Update a camera path parameter and refresh visualization
     */
    private updatePathParameter;
    /**
     * Refresh the camera path visualization
     */
    private refreshPathVisualization;
    /**
     * Set camera path from current camera position
     */
    private setPathFromCurrentCamera;
    private createRecordingSection;
    private takeScreenshot;
    private previewPath;
    private toggleRecording;
    private startRecording;
    private stopRecording;
    private finishRecording;
    private downloadBlob;
    /**
     * Take a screenshot programmatically
     */
    captureScreenshot(options?: Partial<ScreenshotSettings>): Promise<Blob>;
    /**
     * Set screenshot resolution
     */
    setScreenshotResolution(width: number, height: number): void;
    /**
     * Get current screenshot settings
     */
    getScreenshotSettings(): ScreenshotSettings;
    /**
     * Set recording settings
     */
    setRecordingSettings(settings: Partial<RecordingSettings>): void;
    /**
     * Get current recording settings
     */
    getRecordingSettings(): RecordingSettings;
    /**
     * Start recording programmatically
     */
    startRecordingProgrammatic(options?: Partial<RecordingSettings>): Promise<Blob | null>;
    /**
     * Show/hide camera path visualization
     */
    setCameraPathVisible(visible: boolean): void;
    /**
     * Fit camera path to current schematics
     */
    fitCameraPath(): void;
    /**
     * Check if currently recording
     */
    isCurrentlyRecording(): boolean;
}
//# sourceMappingURL=CaptureUI.d.ts.map