// CaptureUI.ts - UI Component for Screenshot and Recording Management
import { BaseUI, UIStyles, UIColors, createLabel, createSelect, createToggle, createSlider, createSettingRow, createSectionTitle, createButton, createNumberInput, } from "./UIComponents";
const DEFAULT_SCREENSHOT_PRESETS = [
    { label: "1080p (1920×1080)", width: 1920, height: 1080 },
    { label: "1440p (2560×1440)", width: 2560, height: 1440 },
    { label: "4K (3840×2160)", width: 3840, height: 2160 },
    { label: "Square (2048×2048)", width: 2048, height: 2048 },
    { label: "Instagram (1080×1350)", width: 1080, height: 1350 },
    { label: "Custom", width: 0, height: 0 },
];
const DEFAULT_SCREENSHOT_SETTINGS = {
    width: 1920,
    height: 1080,
    quality: 0.95,
    format: "image/png",
    filename: "schematic_screenshot",
};
const DEFAULT_RECORDING_SETTINGS = {
    width: 1920,
    height: 1080,
    frameRate: 60,
    duration: 10,
    quality: 0.9,
    filename: "schematic_recording",
};
/**
 * Capture UI Component
 * Provides interface for taking high-resolution screenshots and recording videos
 * of the schematic renderer with camera path support.
 */
export class CaptureUI extends BaseUI {
    constructor(renderer, options = {}) {
        super(renderer.canvas, {
            ...options,
            toggleUIShortcut: options.toggleUIShortcut ?? "KeyC",
        });
        Object.defineProperty(this, "renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "screenshotSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "recordingSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cameraPathSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "screenshotPresets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Callbacks
        Object.defineProperty(this, "onScreenshotTaken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onRecordingComplete", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Recording state
        Object.defineProperty(this, "isRecording", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // UI Elements
        Object.defineProperty(this, "presetSelect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "customWidthInput", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "customHeightInput", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "customSizeContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "screenshotButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "recordButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "recordingStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "progressBar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "progressText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pathVisibilityToggle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.renderer = renderer;
        this.screenshotPresets = options.screenshotPresets ?? DEFAULT_SCREENSHOT_PRESETS;
        this.onScreenshotTaken = options.onScreenshotTaken;
        this.onRecordingComplete = options.onRecordingComplete;
        // Initialize settings
        this.screenshotSettings = { ...DEFAULT_SCREENSHOT_SETTINGS };
        this.recordingSettings = {
            ...DEFAULT_RECORDING_SETTINGS,
            ...options.defaultRecordingSettings,
        };
        this.cameraPathSettings = {
            visible: false,
            pathName: "circularPath",
            autoFit: true,
        };
        // Build UI
        this.buildUI();
    }
    buildUI() {
        // Header
        const header = this.createHeader("Capture");
        this.container.appendChild(header);
        // Content
        const content = document.createElement("div");
        Object.assign(content.style, UIStyles.content);
        // Screenshot Section
        content.appendChild(this.createScreenshotSection());
        // Camera Path Section
        content.appendChild(this.createCameraPathSection());
        // Recording Section
        content.appendChild(this.createRecordingSection());
        this.container.appendChild(content);
    }
    createScreenshotSection() {
        const section = document.createElement("div");
        Object.assign(section.style, UIStyles.section);
        section.appendChild(createSectionTitle("Screenshot"));
        // Resolution Preset
        this.presetSelect = createSelect(this.screenshotPresets.map((p) => ({ value: `${p.width}x${p.height}`, label: p.label })), `${this.screenshotSettings.width}x${this.screenshotSettings.height}`, (value) => {
            if (value === "0x0") {
                this.customSizeContainer.style.display = "block";
            }
            else {
                this.customSizeContainer.style.display = "none";
                const [w, h] = value.split("x").map(Number);
                this.screenshotSettings.width = w;
                this.screenshotSettings.height = h;
            }
        });
        section.appendChild(createSettingRow("Resolution", this.presetSelect));
        // Custom Size Container
        this.customSizeContainer = document.createElement("div");
        this.customSizeContainer.style.display = "none";
        this.customSizeContainer.style.marginTop = "8px";
        const sizeRow = document.createElement("div");
        Object.assign(sizeRow.style, {
            display: "flex",
            gap: "12px",
            alignItems: "center",
        });
        // Width input
        const widthContainer = document.createElement("div");
        widthContainer.style.flex = "1";
        widthContainer.appendChild(createLabel("Width"));
        this.customWidthInput = createNumberInput(this.screenshotSettings.width, {
            min: 100,
            max: 8192,
            step: 1,
            onChange: (val) => {
                this.screenshotSettings.width = val;
            },
        });
        widthContainer.appendChild(this.customWidthInput);
        sizeRow.appendChild(widthContainer);
        // Height input
        const heightContainer = document.createElement("div");
        heightContainer.style.flex = "1";
        heightContainer.appendChild(createLabel("Height"));
        this.customHeightInput = createNumberInput(this.screenshotSettings.height, {
            min: 100,
            max: 8192,
            step: 1,
            onChange: (val) => {
                this.screenshotSettings.height = val;
            },
        });
        heightContainer.appendChild(this.customHeightInput);
        sizeRow.appendChild(heightContainer);
        this.customSizeContainer.appendChild(sizeRow);
        section.appendChild(this.customSizeContainer);
        // Format
        const formatSelect = createSelect([
            { value: "image/png", label: "PNG (Lossless)" },
            { value: "image/jpeg", label: "JPEG (Smaller)" },
        ], this.screenshotSettings.format, (value) => {
            this.screenshotSettings.format = value;
        });
        section.appendChild(createSettingRow("Format", formatSelect));
        // Quality (for JPEG)
        const qualitySlider = createSlider(this.screenshotSettings.quality * 100, {
            min: 50,
            max: 100,
            step: 5,
            formatValue: (v) => `${v}%`,
            onChange: (value) => {
                this.screenshotSettings.quality = value / 100;
            },
        });
        section.appendChild(createSettingRow("Quality", qualitySlider));
        // Screenshot Button
        const buttonContainer = document.createElement("div");
        buttonContainer.style.marginTop = "12px";
        this.screenshotButton = createButton("📸 Take Screenshot", () => this.takeScreenshot());
        this.screenshotButton.style.width = "100%";
        buttonContainer.appendChild(this.screenshotButton);
        section.appendChild(buttonContainer);
        return section;
    }
    createCameraPathSection() {
        const section = document.createElement("div");
        Object.assign(section.style, UIStyles.section);
        section.appendChild(createSectionTitle("Camera Path (Orbit)"));
        // Path Visibility Toggle
        this.pathVisibilityToggle = createToggle(this.cameraPathSettings.visible, (enabled) => {
            this.cameraPathSettings.visible = enabled;
            if (enabled) {
                this.renderer.cameraManager.showPathVisualization(this.cameraPathSettings.pathName);
            }
            else {
                this.renderer.cameraManager.hidePathVisualization(this.cameraPathSettings.pathName);
            }
        });
        section.appendChild(createSettingRow("Show Path", this.pathVisibilityToggle, {
            tooltip: "Display the camera orbit path in the scene",
        }));
        // Get current path parameters
        const path = this.renderer.cameraManager.cameraPathManager.getPath(this.cameraPathSettings.pathName);
        const initialRadius = path?.getRadius?.() ?? 20;
        const initialHeight = path?.getHeight?.() ?? 10;
        // Orbit Radius Slider
        const radiusSlider = createSlider(initialRadius, {
            min: 5,
            max: 200,
            step: 1,
            formatValue: (v) => `${v.toFixed(0)}`,
            onChange: (value) => {
                this.updatePathParameter("radius", value);
            },
        });
        section.appendChild(createSettingRow("Radius", radiusSlider, {
            tooltip: "Distance from the center of the orbit",
        }));
        // Orbit Height Slider
        const heightSlider = createSlider(initialHeight, {
            min: -50,
            max: 100,
            step: 1,
            formatValue: (v) => `${v.toFixed(0)}`,
            onChange: (value) => {
                this.updatePathParameter("height", value);
            },
        });
        section.appendChild(createSettingRow("Height", heightSlider, {
            tooltip: "Camera height above the target",
        }));
        // Path Controls Row
        const controlsRow = document.createElement("div");
        Object.assign(controlsRow.style, {
            display: "flex",
            gap: "8px",
            marginTop: "12px",
        });
        // Fit Path Button
        const fitBtn = createButton("Auto Fit", () => {
            this.renderer.cameraManager.cameraPathManager.fitCircularPathToSchematics(this.cameraPathSettings.pathName);
            // Refresh visualization if visible
            this.refreshPathVisualization();
        }, { primary: false });
        fitBtn.style.flex = "1";
        controlsRow.appendChild(fitBtn);
        // Preview Path Button
        const previewBtn = createButton("Preview", () => this.previewPath(), { primary: false });
        previewBtn.style.flex = "1";
        controlsRow.appendChild(previewBtn);
        section.appendChild(controlsRow);
        // Use Current Camera Button
        const useCameraBtn = createButton("Use Current View", () => {
            this.setPathFromCurrentCamera();
        }, { primary: false });
        useCameraBtn.style.width = "100%";
        useCameraBtn.style.marginTop = "8px";
        section.appendChild(useCameraBtn);
        return section;
    }
    /**
     * Update a camera path parameter and refresh visualization
     */
    updatePathParameter(param, value) {
        const path = this.renderer.cameraManager.cameraPathManager.getPath(this.cameraPathSettings.pathName);
        if (!path || typeof path.updateParameters !== "function")
            return;
        const params = {};
        params[param] = value;
        path.updateParameters(params);
        this.refreshPathVisualization();
    }
    /**
     * Refresh the camera path visualization
     */
    refreshPathVisualization() {
        if (this.cameraPathSettings.visible) {
            this.renderer.cameraManager.hidePathVisualization(this.cameraPathSettings.pathName);
            this.renderer.cameraManager.showPathVisualization(this.cameraPathSettings.pathName);
        }
    }
    /**
     * Set camera path from current camera position
     */
    setPathFromCurrentCamera() {
        const path = this.renderer.cameraManager.cameraPathManager.getPath(this.cameraPathSettings.pathName);
        if (!path || typeof path.fitToSchematics !== "function")
            return;
        // Use the fitToSchematics method which sets the path based on current camera
        path.fitToSchematics();
        this.refreshPathVisualization();
    }
    createRecordingSection() {
        const section = document.createElement("div");
        // Last section, no bottom border
        section.style.paddingBottom = "0";
        section.appendChild(createSectionTitle("Recording"));
        // Check FFmpeg availability
        const ffmpegAvailable = !!this.renderer.options.ffmpeg;
        if (!ffmpegAvailable) {
            const warningDiv = document.createElement("div");
            Object.assign(warningDiv.style, {
                padding: "12px",
                backgroundColor: "rgba(255, 152, 0, 0.15)",
                borderRadius: "4px",
                fontSize: "12px",
                color: UIColors.warning,
                marginBottom: "12px",
            });
            warningDiv.innerHTML = `
				<strong>⚠️ FFmpeg not available</strong><br>
				Video recording requires FFmpeg. Pass it to the renderer options to enable recording.
			`;
            section.appendChild(warningDiv);
        }
        // Resolution (uses same presets as screenshot)
        const recordPresetSelect = createSelect([
            { value: "1920x1080", label: "1080p (1920×1080)" },
            { value: "2560x1440", label: "1440p (2560×1440)" },
            { value: "3840x2160", label: "4K (3840×2160)" },
        ], `${this.recordingSettings.width}x${this.recordingSettings.height}`, (value) => {
            const [w, h] = value.split("x").map(Number);
            this.recordingSettings.width = w;
            this.recordingSettings.height = h;
        });
        section.appendChild(createSettingRow("Resolution", recordPresetSelect));
        // Frame Rate
        const fpsSelect = createSelect([
            { value: "30", label: "30 FPS" },
            { value: "60", label: "60 FPS" },
        ], this.recordingSettings.frameRate.toString(), (value) => {
            this.recordingSettings.frameRate = parseInt(value);
        });
        section.appendChild(createSettingRow("Frame Rate", fpsSelect));
        // Duration
        const durationSlider = createSlider(this.recordingSettings.duration, {
            min: 5,
            max: 60,
            step: 5,
            formatValue: (v) => `${v}s`,
            onChange: (value) => {
                this.recordingSettings.duration = value;
            },
        });
        section.appendChild(createSettingRow("Duration", durationSlider));
        // Recording Status
        this.recordingStatus = document.createElement("div");
        this.recordingStatus.style.display = "none";
        Object.assign(this.recordingStatus.style, {
            marginTop: "12px",
            padding: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "4px",
        });
        this.progressText = document.createElement("div");
        Object.assign(this.progressText.style, {
            fontSize: "12px",
            color: UIColors.textMuted,
            marginBottom: "8px",
        });
        this.progressText.textContent = "Preparing recording...";
        this.recordingStatus.appendChild(this.progressText);
        const progressContainer = document.createElement("div");
        Object.assign(progressContainer.style, {
            width: "100%",
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "2px",
            overflow: "hidden",
        });
        this.progressBar = document.createElement("div");
        Object.assign(this.progressBar.style, {
            width: "0%",
            height: "100%",
            backgroundColor: UIColors.primary,
            borderRadius: "2px",
            transition: "width 0.2s ease-out",
        });
        progressContainer.appendChild(this.progressBar);
        this.recordingStatus.appendChild(progressContainer);
        section.appendChild(this.recordingStatus);
        // Record Button
        const buttonContainer = document.createElement("div");
        Object.assign(buttonContainer.style, {
            marginTop: "12px",
            display: "flex",
            gap: "8px",
        });
        this.recordButton = createButton("🎬 Start Recording", () => this.toggleRecording());
        this.recordButton.style.flex = "1";
        if (!ffmpegAvailable) {
            this.recordButton.disabled = true;
            this.recordButton.style.opacity = "0.5";
            this.recordButton.style.cursor = "not-allowed";
        }
        buttonContainer.appendChild(this.recordButton);
        section.appendChild(buttonContainer);
        return section;
    }
    // Actions
    async takeScreenshot() {
        this.screenshotButton.textContent = "Processing...";
        this.screenshotButton.disabled = true;
        try {
            const blob = await this.renderer.cameraManager.recordingManager.takeScreenshot({
                width: this.screenshotSettings.width,
                height: this.screenshotSettings.height,
                quality: this.screenshotSettings.quality,
                format: this.screenshotSettings.format,
            });
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
            const extension = this.screenshotSettings.format === "image/png" ? "png" : "jpg";
            const filename = `${this.screenshotSettings.filename}_${timestamp}.${extension}`;
            // Trigger callback
            if (this.onScreenshotTaken) {
                this.onScreenshotTaken(blob, filename);
            }
            // Auto-download
            this.downloadBlob(blob, filename);
            // Show success feedback
            this.screenshotButton.textContent = "✓ Screenshot Saved!";
            setTimeout(() => {
                this.screenshotButton.textContent = "📸 Take Screenshot";
                this.screenshotButton.disabled = false;
            }, 2000);
        }
        catch (error) {
            console.error("Screenshot failed:", error);
            this.screenshotButton.textContent = "❌ Failed";
            setTimeout(() => {
                this.screenshotButton.textContent = "📸 Take Screenshot";
                this.screenshotButton.disabled = false;
            }, 2000);
        }
    }
    async previewPath() {
        // Fit path if auto-fit is enabled
        if (this.cameraPathSettings.autoFit) {
            this.renderer.cameraManager.cameraPathManager.fitCircularPathToSchematics(this.cameraPathSettings.pathName);
        }
        // Animate camera along path as preview (shorter duration)
        const path = this.renderer.cameraManager.getCameraPath(this.cameraPathSettings.pathName);
        if (path) {
            await this.renderer.cameraManager.animateCameraAlongPath({
                pathName: this.cameraPathSettings.pathName,
                totalFrames: 180, // ~3 seconds at 60fps
                targetFps: 60,
                lookAtTarget: true,
            });
        }
    }
    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        }
        else {
            await this.startRecording();
        }
    }
    async startRecording() {
        this.isRecording = true;
        this.recordButton.textContent = "⏹ Stop Recording";
        this.recordButton.style.backgroundColor = UIColors.danger;
        this.recordingStatus.style.display = "block";
        // Fit path if auto-fit is enabled
        if (this.cameraPathSettings.autoFit) {
            this.renderer.cameraManager.cameraPathManager.fitCircularPathToSchematics(this.cameraPathSettings.pathName);
        }
        try {
            await this.renderer.cameraManager.recordingManager.startRecording(this.recordingSettings.duration, {
                width: this.recordingSettings.width,
                height: this.recordingSettings.height,
                frameRate: this.recordingSettings.frameRate,
                quality: this.recordingSettings.quality,
                onStart: () => {
                    this.progressText.textContent = "Recording frames...";
                },
                onProgress: (progress) => {
                    const percent = Math.round(progress * 100);
                    this.progressBar.style.width = `${percent * 0.7}%`; // 70% for recording
                    this.progressText.textContent = `Recording: ${percent}%`;
                },
                onFfmpegProgress: (progress) => {
                    this.progressBar.style.width = `${70 + progress * 0.3}%`; // 30% for encoding
                    this.progressText.textContent = `Encoding: ${Math.round(progress)}%`;
                },
                onComplete: (blob) => {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
                    const filename = `${this.recordingSettings.filename}_${timestamp}.mp4`;
                    // Trigger callback
                    if (this.onRecordingComplete) {
                        this.onRecordingComplete(blob, filename);
                    }
                    // Auto-download
                    this.downloadBlob(blob, filename);
                    this.finishRecording(true);
                },
            });
        }
        catch (error) {
            console.error("Recording failed:", error);
            this.finishRecording(false);
        }
    }
    stopRecording() {
        this.renderer.cameraManager.recordingManager.stopRecording();
        this.finishRecording(false);
    }
    finishRecording(success) {
        this.isRecording = false;
        this.recordButton.textContent = "🎬 Start Recording";
        this.recordButton.style.backgroundColor = UIColors.primary;
        if (success) {
            this.progressText.textContent = "✓ Recording saved!";
            this.progressBar.style.width = "100%";
        }
        else {
            this.progressText.textContent = "Recording cancelled";
        }
        setTimeout(() => {
            this.recordingStatus.style.display = "none";
            this.progressBar.style.width = "0%";
        }, 3000);
    }
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    // Public API
    /**
     * Take a screenshot programmatically
     */
    async captureScreenshot(options) {
        const settings = { ...this.screenshotSettings, ...options };
        return this.renderer.cameraManager.recordingManager.takeScreenshot({
            width: settings.width,
            height: settings.height,
            quality: settings.quality,
            format: settings.format,
        });
    }
    /**
     * Set screenshot resolution
     */
    setScreenshotResolution(width, height) {
        this.screenshotSettings.width = width;
        this.screenshotSettings.height = height;
    }
    /**
     * Get current screenshot settings
     */
    getScreenshotSettings() {
        return { ...this.screenshotSettings };
    }
    /**
     * Set recording settings
     */
    setRecordingSettings(settings) {
        this.recordingSettings = { ...this.recordingSettings, ...settings };
    }
    /**
     * Get current recording settings
     */
    getRecordingSettings() {
        return { ...this.recordingSettings };
    }
    /**
     * Start recording programmatically
     */
    async startRecordingProgrammatic(options) {
        const settings = { ...this.recordingSettings, ...options };
        return new Promise((resolve, reject) => {
            this.renderer.cameraManager.recordingManager
                .startRecording(settings.duration, {
                width: settings.width,
                height: settings.height,
                frameRate: settings.frameRate,
                quality: settings.quality,
                onComplete: (blob) => resolve(blob),
            })
                .catch(reject);
        });
    }
    /**
     * Show/hide camera path visualization
     */
    setCameraPathVisible(visible) {
        this.cameraPathSettings.visible = visible;
        if (visible) {
            this.renderer.cameraManager.showPathVisualization(this.cameraPathSettings.pathName);
        }
        else {
            this.renderer.cameraManager.hidePathVisualization(this.cameraPathSettings.pathName);
        }
    }
    /**
     * Fit camera path to current schematics
     */
    fitCameraPath() {
        this.renderer.cameraManager.cameraPathManager.fitCircularPathToSchematics(this.cameraPathSettings.pathName);
    }
    /**
     * Check if currently recording
     */
    isCurrentlyRecording() {
        return this.isRecording;
    }
}
