// RenderSettingsUI.ts - UI Component for Render Settings Management
import { BaseUI, UIStyles, createLabel, createSelect, createToggle, createSlider, createColorPicker, createSettingRow, createSectionTitle, createButton, } from "./UIComponents";
import * as THREE from "three";
const DEFAULT_RENDER_SETTINGS = {
    hdriEnabled: true,
    backgroundColor: "#87ceeb",
    cameraMode: "perspective",
    isometricPitch: 35.264,
    isometricYaw: 45,
    ssaoEnabled: true,
    ssaoIntensity: 5.0,
    ssaoRadius: 1.0,
    smaaEnabled: true,
    gammaEnabled: true,
    gammaValue: 0.5,
    showGrid: false,
    showAxes: false,
    ambientLightIntensity: 2.2,
    directionalLightIntensity: 1.0,
    autoOrbitEnabled: false,
    autoOrbitDuration: 30,
};
/**
 * Render Settings UI Component
 * Provides a visual interface for tweaking render settings like HDRI, background color,
 * camera modes, post-processing effects, and scene helpers.
 */
export class RenderSettingsUI extends BaseUI {
    constructor(renderer, options = {}) {
        super(renderer.canvas, {
            ...options,
            toggleUIShortcut: options.toggleUIShortcut ?? "KeyR",
        });
        Object.defineProperty(this, "renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onSettingsChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // UI Elements that need updating
        Object.defineProperty(this, "cameraModeSelect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isometricControls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hdriToggle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ssaoToggle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "autoOrbitToggle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.renderer = renderer;
        this.onSettingsChange = options.onSettingsChange;
        // Initialize settings from current renderer state
        this.settings = this.initializeSettingsFromRenderer(options.defaultSettings);
        // Build UI
        this.buildUI();
        // Subscribe to renderer events
        this.subscribeToEvents();
    }
    initializeSettingsFromRenderer(defaultOverrides) {
        const settings = { ...DEFAULT_RENDER_SETTINGS };
        // Get current camera mode
        const cameraManager = this.renderer.cameraManager;
        if (cameraManager) {
            const activeCameraKey = cameraManager.activeCameraKey;
            if (activeCameraKey === "isometric" ||
                activeCameraKey === "perspective" ||
                activeCameraKey === "perspective_fpv") {
                settings.cameraMode = activeCameraKey;
            }
            // Get isometric angles if available
            const angles = cameraManager.getIsometricAngles();
            if (angles) {
                settings.isometricPitch = angles.pitch;
                settings.isometricYaw = angles.yaw;
            }
            // Get auto-orbit state
            settings.autoOrbitEnabled = cameraManager.isAutoOrbitEnabled();
        }
        // Get HDRI state
        const renderManager = this.renderer.renderManager;
        if (renderManager) {
            settings.hdriEnabled = !!this.renderer.options.hdri;
            settings.ssaoEnabled = renderManager.isSSAOEnabled();
            const presets = renderManager.getSSAOPresets();
            if (presets) {
                settings.ssaoIntensity = presets.perspective.intensity;
                settings.ssaoRadius = presets.perspective.aoRadius;
            }
        }
        // Get scene state
        const sceneManager = this.renderer.sceneManager;
        if (sceneManager) {
            settings.showGrid = sceneManager.showGrid;
            settings.showAxes = sceneManager.showAxes;
            // Get light intensities
            const lights = sceneManager.getLights();
            const ambient = lights.get("ambientLight");
            const directional = lights.get("directionalLight");
            if (ambient)
                settings.ambientLightIntensity = ambient.intensity;
            if (directional)
                settings.directionalLightIntensity = directional.intensity;
        }
        // Get gamma from options
        settings.gammaValue = this.renderer.options.gamma ?? 0.5;
        // Apply any overrides
        return { ...settings, ...defaultOverrides };
    }
    buildUI() {
        // Header
        const header = this.createHeader("Render Settings");
        this.container.appendChild(header);
        // Content
        const content = document.createElement("div");
        Object.assign(content.style, UIStyles.content);
        // Background Section
        content.appendChild(this.createBackgroundSection());
        // Camera Section
        content.appendChild(this.createCameraSection());
        // Post-Processing Section
        content.appendChild(this.createPostProcessingSection());
        // Scene Section
        content.appendChild(this.createSceneSection());
        // Lighting Section
        content.appendChild(this.createLightingSection());
        this.container.appendChild(content);
        // Footer with reset button
        const footer = this.createFooter();
        this.container.appendChild(footer);
    }
    createBackgroundSection() {
        const section = document.createElement("div");
        Object.assign(section.style, UIStyles.section);
        section.appendChild(createSectionTitle("Background"));
        // HDRI Toggle
        this.hdriToggle = createToggle(this.settings.hdriEnabled, (enabled) => {
            this.settings.hdriEnabled = enabled;
            this.applyHDRISetting(enabled);
            this.emitChange();
        });
        section.appendChild(createSettingRow("HDRI Environment", this.hdriToggle, {
            tooltip: "Use HDRI for realistic lighting and reflections (works in all camera modes)",
        }));
        // Background Color
        const colorPicker = createColorPicker(this.settings.backgroundColor, (color) => {
            this.settings.backgroundColor = color;
            this.applyBackgroundColor(color);
            this.emitChange();
        });
        section.appendChild(createSettingRow("Background Color", colorPicker, {
            tooltip: "Solid background color (visible when HDRI is disabled)",
        }));
        return section;
    }
    createCameraSection() {
        const section = document.createElement("div");
        Object.assign(section.style, UIStyles.section);
        section.appendChild(createSectionTitle("Camera"));
        // Camera Mode
        this.cameraModeSelect = createSelect([
            { value: "perspective", label: "Perspective" },
            { value: "isometric", label: "Isometric" },
            { value: "perspective_fpv", label: "First Person" },
        ], this.settings.cameraMode, (value) => {
            this.settings.cameraMode = value;
            this.applyCameraMode(this.settings.cameraMode);
            this.updateIsometricControlsVisibility();
            this.emitChange();
        });
        section.appendChild(createSettingRow("Camera Mode", this.cameraModeSelect));
        // Isometric Controls Container
        this.isometricControls = document.createElement("div");
        this.isometricControls.style.marginTop = "8px";
        // Isometric Pitch
        const pitchLabel = createLabel("Pitch Angle");
        const pitchSlider = createSlider(this.settings.isometricPitch, {
            min: 10,
            max: 80,
            step: 1,
            formatValue: (v) => `${v.toFixed(0)}°`,
            onChange: (value) => {
                this.settings.isometricPitch = value;
                this.applyIsometricAngles();
                this.emitChange();
            },
        });
        this.isometricControls.appendChild(pitchLabel);
        this.isometricControls.appendChild(pitchSlider);
        // Isometric Yaw
        const yawLabel = createLabel("Rotation Angle");
        yawLabel.style.marginTop = "12px";
        const yawSlider = createSlider(this.settings.isometricYaw, {
            min: 0,
            max: 90,
            step: 1,
            formatValue: (v) => `${v.toFixed(0)}°`,
            onChange: (value) => {
                this.settings.isometricYaw = value;
                this.applyIsometricAngles();
                this.emitChange();
            },
        });
        this.isometricControls.appendChild(yawLabel);
        this.isometricControls.appendChild(yawSlider);
        // Reset isometric button
        const resetIsoBtn = createButton("Reset to True Isometric", () => {
            this.settings.isometricPitch = 35.264;
            this.settings.isometricYaw = 45;
            this.renderer.cameraManager.resetIsometricAngles(true);
            this.updateUIFromSettings();
            this.emitChange();
        }, { primary: false });
        resetIsoBtn.style.marginTop = "12px";
        resetIsoBtn.style.width = "100%";
        this.isometricControls.appendChild(resetIsoBtn);
        section.appendChild(this.isometricControls);
        this.updateIsometricControlsVisibility();
        // Auto-Orbit
        const orbitRow = document.createElement("div");
        orbitRow.style.marginTop = "16px";
        this.autoOrbitToggle = createToggle(this.settings.autoOrbitEnabled, (enabled) => {
            this.settings.autoOrbitEnabled = enabled;
            this.renderer.setAutoOrbit(enabled);
            this.emitChange();
        });
        orbitRow.appendChild(createSettingRow("Auto-Orbit", this.autoOrbitToggle));
        // Orbit Duration
        const durationSlider = createSlider(this.settings.autoOrbitDuration, {
            min: 5,
            max: 120,
            step: 5,
            formatValue: (v) => `${v}s`,
            onChange: (value) => {
                this.settings.autoOrbitDuration = value;
                this.renderer.setAutoOrbitDuration(value);
                this.emitChange();
            },
        });
        orbitRow.appendChild(createSettingRow("Orbit Duration", durationSlider));
        section.appendChild(orbitRow);
        return section;
    }
    createPostProcessingSection() {
        const section = document.createElement("div");
        Object.assign(section.style, UIStyles.section);
        section.appendChild(createSectionTitle("Post-Processing"));
        // SSAO Toggle
        this.ssaoToggle = createToggle(this.settings.ssaoEnabled, (enabled) => {
            this.settings.ssaoEnabled = enabled;
            this.renderer.renderManager?.setSSAOEnabled(enabled);
            this.emitChange();
        });
        section.appendChild(createSettingRow("Ambient Occlusion (SSAO)", this.ssaoToggle, {
            tooltip: "Adds soft shadows in corners and crevices for realistic depth",
        }));
        // SSAO Intensity
        const intensitySlider = createSlider(this.settings.ssaoIntensity, {
            min: 0.5,
            max: 10,
            step: 0.5,
            formatValue: (v) => v.toFixed(1),
            onChange: (value) => {
                this.settings.ssaoIntensity = value;
                this.renderer.setSSAOParameters({ intensity: value });
                this.emitChange();
            },
        });
        section.appendChild(createSettingRow("SSAO Intensity", intensitySlider));
        // SSAO Radius
        const radiusSlider = createSlider(this.settings.ssaoRadius, {
            min: 0.1,
            max: 3,
            step: 0.1,
            formatValue: (v) => v.toFixed(1),
            onChange: (value) => {
                this.settings.ssaoRadius = value;
                this.renderer.setSSAOParameters({ aoRadius: value });
                this.emitChange();
            },
        });
        section.appendChild(createSettingRow("SSAO Radius", radiusSlider));
        // SMAA Toggle
        const smaaToggle = createToggle(this.settings.smaaEnabled, (enabled) => {
            this.settings.smaaEnabled = enabled;
            if (enabled) {
                this.renderer.renderManager?.enableEffect("smaa");
            }
            else {
                this.renderer.renderManager?.disableEffect("smaa");
            }
            this.emitChange();
        });
        section.appendChild(createSettingRow("Anti-Aliasing (SMAA)", smaaToggle, {
            tooltip: "Smooths jagged edges for cleaner visuals",
        }));
        // Gamma Toggle & Value
        const gammaToggle = createToggle(this.settings.gammaEnabled, (enabled) => {
            this.settings.gammaEnabled = enabled;
            if (enabled) {
                this.renderer.renderManager?.enableEffect("gammaCorrection");
            }
            else {
                this.renderer.renderManager?.disableEffect("gammaCorrection");
            }
            this.emitChange();
        });
        section.appendChild(createSettingRow("Gamma Correction", gammaToggle));
        const gammaSlider = createSlider(this.settings.gammaValue, {
            min: 0.1,
            max: 1.5,
            step: 0.05,
            formatValue: (v) => v.toFixed(2),
            onChange: (value) => {
                this.settings.gammaValue = value;
                this.renderer.renderManager?.setGamma(value);
                this.emitChange();
            },
        });
        section.appendChild(createSettingRow("Gamma Value", gammaSlider));
        return section;
    }
    createSceneSection() {
        const section = document.createElement("div");
        Object.assign(section.style, UIStyles.section);
        section.appendChild(createSectionTitle("Scene Helpers"));
        // Grid Toggle
        const gridToggle = createToggle(this.settings.showGrid, (enabled) => {
            this.settings.showGrid = enabled;
            this.renderer.sceneManager.showGrid = enabled;
            this.emitChange();
        });
        section.appendChild(createSettingRow("Show Grid", gridToggle));
        // Axes Toggle
        const axesToggle = createToggle(this.settings.showAxes, (enabled) => {
            this.settings.showAxes = enabled;
            this.renderer.sceneManager.showAxes = enabled;
            this.emitChange();
        });
        section.appendChild(createSettingRow("Show Axes", axesToggle));
        return section;
    }
    createLightingSection() {
        const section = document.createElement("div");
        // Last section, no border
        section.style.paddingBottom = "0";
        section.appendChild(createSectionTitle("Lighting"));
        // Ambient Light
        const ambientSlider = createSlider(this.settings.ambientLightIntensity, {
            min: 0,
            max: 5,
            step: 0.1,
            formatValue: (v) => v.toFixed(1),
            onChange: (value) => {
                this.settings.ambientLightIntensity = value;
                this.applyLightIntensity("ambientLight", value);
                this.emitChange();
            },
        });
        section.appendChild(createSettingRow("Ambient Light", ambientSlider));
        // Directional Light
        const directionalSlider = createSlider(this.settings.directionalLightIntensity, {
            min: 0,
            max: 3,
            step: 0.1,
            formatValue: (v) => v.toFixed(1),
            onChange: (value) => {
                this.settings.directionalLightIntensity = value;
                this.applyLightIntensity("directionalLight", value);
                this.emitChange();
            },
        });
        section.appendChild(createSettingRow("Directional Light", directionalSlider));
        return section;
    }
    createFooter() {
        const footer = document.createElement("div");
        Object.assign(footer.style, UIStyles.footer);
        // Reset button
        const resetBtn = createButton("Reset All", () => {
            this.resetToDefaults();
        }, { primary: false });
        footer.appendChild(resetBtn);
        // Focus camera button
        const focusBtn = createButton("Focus Camera", () => {
            this.renderer.cameraManager.focusOnSchematics({ animationDuration: 0.5 });
        });
        footer.appendChild(focusBtn);
        return footer;
    }
    updateIsometricControlsVisibility() {
        if (this.isometricControls) {
            this.isometricControls.style.display =
                this.settings.cameraMode === "isometric" ? "block" : "none";
        }
    }
    // Apply settings to renderer
    applyHDRISetting(enabled) {
        if (!enabled) {
            // Remove HDRI background
            this.renderer.sceneManager.scene.background = new THREE.Color(this.settings.backgroundColor);
        }
        else if (this.renderer.options.hdri) {
            // Reload HDRI
            this.renderer.renderManager?.setupHDRIBackground(this.renderer.options.hdri);
        }
    }
    applyBackgroundColor(color) {
        // Set isometric background color
        this.renderer.renderManager?.setIsometricBackgroundColor(color);
        // If HDRI is off, also set main background
        if (!this.settings.hdriEnabled) {
            this.renderer.sceneManager.scene.background = new THREE.Color(color);
        }
    }
    applyCameraMode(mode) {
        this.renderer.cameraManager.switchCameraPreset(mode);
    }
    applyIsometricAngles() {
        if (this.settings.cameraMode === "isometric") {
            this.renderer.cameraManager.setIsometricAngles(this.settings.isometricPitch, this.settings.isometricYaw, true);
        }
    }
    applyLightIntensity(lightName, intensity) {
        const lights = this.renderer.sceneManager.getLights();
        const light = lights.get(lightName);
        if (light) {
            light.intensity = intensity;
        }
    }
    resetToDefaults() {
        this.settings = { ...DEFAULT_RENDER_SETTINGS };
        this.applyAllSettings();
        this.updateUIFromSettings();
        this.emitChange();
    }
    applyAllSettings() {
        // Apply background
        this.applyHDRISetting(this.settings.hdriEnabled);
        this.applyBackgroundColor(this.settings.backgroundColor);
        // Apply camera
        this.applyCameraMode(this.settings.cameraMode);
        if (this.settings.cameraMode === "isometric") {
            this.applyIsometricAngles();
        }
        // Apply auto-orbit
        this.renderer.setAutoOrbit(this.settings.autoOrbitEnabled);
        this.renderer.setAutoOrbitDuration(this.settings.autoOrbitDuration);
        // Apply post-processing
        this.renderer.renderManager?.setSSAOEnabled(this.settings.ssaoEnabled);
        this.renderer.setSSAOParameters({
            intensity: this.settings.ssaoIntensity,
            aoRadius: this.settings.ssaoRadius,
        });
        if (this.settings.smaaEnabled) {
            this.renderer.renderManager?.enableEffect("smaa");
        }
        else {
            this.renderer.renderManager?.disableEffect("smaa");
        }
        if (this.settings.gammaEnabled) {
            this.renderer.renderManager?.enableEffect("gammaCorrection");
        }
        else {
            this.renderer.renderManager?.disableEffect("gammaCorrection");
        }
        this.renderer.renderManager?.setGamma(this.settings.gammaValue);
        // Apply scene helpers
        this.renderer.sceneManager.showGrid = this.settings.showGrid;
        this.renderer.sceneManager.showAxes = this.settings.showAxes;
        // Apply lighting
        this.applyLightIntensity("ambientLight", this.settings.ambientLightIntensity);
        this.applyLightIntensity("directionalLight", this.settings.directionalLightIntensity);
    }
    updateUIFromSettings() {
        // This would require storing references to all controls
        // For now, we rebuild the UI (simpler approach)
        // In a production app, you'd update each control's value
    }
    subscribeToEvents() {
        // Listen for camera changes from external sources
        this.renderer.cameraManager.on("cameraChanged", (event) => {
            if (event.newCamera !== this.settings.cameraMode) {
                this.settings.cameraMode = event.newCamera;
                if (this.cameraModeSelect) {
                    this.cameraModeSelect.value = event.newCamera;
                }
                this.updateIsometricControlsVisibility();
            }
        });
    }
    emitChange() {
        if (this.onSettingsChange) {
            this.onSettingsChange({ ...this.settings });
        }
    }
    // Public API
    /**
     * Get current render settings
     */
    getSettings() {
        return { ...this.settings };
    }
    /**
     * Update settings programmatically
     */
    setSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.applyAllSettings();
        this.emitChange();
    }
    /**
     * Set camera mode
     */
    setCameraMode(mode) {
        this.settings.cameraMode = mode;
        this.applyCameraMode(mode);
        if (this.cameraModeSelect) {
            this.cameraModeSelect.value = mode;
        }
        this.updateIsometricControlsVisibility();
        this.emitChange();
    }
    /**
     * Set isometric angles
     */
    setIsometricAngles(pitch, yaw) {
        this.settings.isometricPitch = pitch;
        this.settings.isometricYaw = yaw;
        this.applyIsometricAngles();
        this.emitChange();
    }
    /**
     * Enable/disable SSAO
     */
    setSSAOEnabled(enabled) {
        this.settings.ssaoEnabled = enabled;
        this.renderer.renderManager?.setSSAOEnabled(enabled);
        this.emitChange();
    }
    /**
     * Set background color
     */
    setBackgroundColor(color) {
        this.settings.backgroundColor = color;
        this.applyBackgroundColor(color);
        this.emitChange();
    }
    /**
     * Toggle HDRI
     */
    setHDRIEnabled(enabled) {
        this.settings.hdriEnabled = enabled;
        this.applyHDRISetting(enabled);
        this.emitChange();
    }
    /**
     * Set auto-orbit
     */
    setAutoOrbit(enabled, duration) {
        this.settings.autoOrbitEnabled = enabled;
        if (duration !== undefined) {
            this.settings.autoOrbitDuration = duration;
        }
        this.renderer.setAutoOrbit(enabled);
        if (duration !== undefined) {
            this.renderer.setAutoOrbitDuration(duration);
        }
        this.emitChange();
    }
}
