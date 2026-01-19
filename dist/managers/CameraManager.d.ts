import * as THREE from "three";
import { EventEmitter } from "events";
import { SchematicRenderer } from "../SchematicRenderer";
import { CameraWrapper } from "./CameraWrapper";
import { CameraPath } from "../camera/CameraPath";
import { CameraPathManager } from "./CameraPathManager";
import { RecordingManager, RecordingOptions } from "./RecordingManager";
export interface CameraManagerOptions {
    position?: [number, number, number];
    defaultCameraPreset?: "perspective" | "isometric" | "perspective_fpv";
    showCameraPathVisualization?: boolean;
    enableZoomInOnLoad?: boolean;
    zoomInDuration?: number;
    autoOrbitAfterZoom?: boolean;
    preserveCameraOnUpdate?: boolean;
    useTightBounds?: boolean;
}
export interface CameraFrame {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    target: THREE.Vector3;
    progress: number;
}
export interface CameraPreset {
    type: "perspective" | "orthographic";
    position: THREE.Vector3Tuple;
    rotation?: THREE.Vector3Tuple;
    fov?: number;
    controlType: ControlType;
    controlSettings?: {
        enableDamping?: boolean;
        dampingFactor?: number;
        minDistance?: number;
        maxDistance?: number;
        enableZoom?: boolean;
        enableRotate?: boolean;
        enablePan?: boolean;
        minPolarAngle?: number;
        maxPolarAngle?: number;
    };
}
export interface CameraAnimationWithRecordingOptions {
    pathName?: string;
    totalFrames?: number;
    targetFps?: number;
    easing?: (t: number) => number;
    lookAtTarget?: boolean;
    updateControls?: boolean;
    onStart?: () => void;
    onUpdate?: (progress: number) => void;
    onComplete?: () => void;
    recording?: {
        enabled: boolean;
        options?: RecordingOptions;
    };
}
type ControlType = "orbit" | "creative" | "none";
export declare class CameraManager extends EventEmitter {
    private schematicRenderer;
    private cameras;
    cameraOptions: CameraManagerOptions;
    private activeCameraKey;
    controls: Map<string, any>;
    activeControlKey: string;
    private rendererDomElement;
    private animationRequestId;
    private isAnimating;
    private animationStartPosition;
    private animationStartRotation;
    recordingManager: RecordingManager;
    private autoOrbitEnabled;
    private autoOrbitAnimationId;
    private autoOrbitStartTime;
    private autoOrbitDuration;
    cameraPathManager: CameraPathManager;
    static readonly CAMERA_PRESETS: {
        readonly isometric: {
            readonly type: "orthographic";
            readonly position: readonly [0, 0, 20];
            readonly rotation: readonly [number, number, 0];
            readonly controlType: "orbit";
            readonly fov: 45;
            readonly controlSettings: {
                readonly enableDamping: true;
                readonly dampingFactor: 0.08;
                readonly minDistance: 5;
                readonly maxDistance: 500;
                readonly enableZoom: true;
                readonly enableRotate: true;
                readonly enablePan: true;
                readonly panSpeed: 1;
                readonly rotateSpeed: 0.8;
                readonly zoomSpeed: 1.2;
                readonly minPolarAngle: number;
                readonly maxPolarAngle: number;
            };
        };
        readonly perspective: {
            readonly type: "perspective";
            readonly position: readonly [0, 20, 20];
            readonly rotation: readonly [number, 0, 0];
            readonly controlType: "orbit";
            readonly fov: 60;
            readonly controlSettings: {
                readonly enableDamping: true;
                readonly dampingFactor: 0.08;
                readonly minDistance: 1;
                readonly maxDistance: 1000;
                readonly enableZoom: true;
                readonly enableRotate: true;
                readonly enablePan: true;
                readonly panSpeed: 1;
                readonly rotateSpeed: 0.8;
                readonly zoomSpeed: 1.2;
            };
        };
        readonly perspective_fpv: {
            readonly type: "perspective";
            readonly position: readonly [0, 2, 0];
            readonly rotation: readonly [0, 0, 0];
            readonly fov: 90;
            readonly controlType: "creative";
            readonly controlSettings: {
                readonly movementSpeed: THREE.Vector3;
            };
        };
    };
    constructor(schematicRenderer: SchematicRenderer, options?: CameraManagerOptions);
    private createCamera;
    private getDefaultCameraPath;
    animateCameraAlongPath(pathOrOptions?: CameraPath | CameraAnimationWithRecordingOptions): Promise<void>;
    isCurrentlyAnimating(): boolean;
    stopAnimation(): void;
    switchCameraPreset(presetName: string): void;
    updatePathParameters(name: string, params: any): void;
    showPathVisualization(name: string): void;
    hidePathVisualization(name: string): void;
    getCameraPath(name: string): CameraPath | undefined;
    private createControls;
    switchControls(type: ControlType): void;
    private setupControlEvents;
    private setupIsometricControls;
    update(deltaTime?: number): void;
    get activeCamera(): CameraWrapper;
    updateAspectRatio(aspect: number): void;
    lookAt(target: THREE.Vector3 | THREE.Vector3Tuple): void;
    lookAtSchematicsCenter(): void;
    /**
     * Enhanced focusOnSchematics method with proper framing calculations
     */
    focusOnSchematics(options?: {
        padding?: number;
        animationDuration?: number;
        easing?: (t: number) => number;
        skipPathFitting?: boolean;
        useTightBounds?: boolean;
        preserveCamera?: boolean;
    }): Promise<void>;
    /**
     * Calculate optimal orthographic camera size
     * For isometric cameras, this accounts for the 3D object's projection at the viewing angle
     */
    private calculateOrthographicSize;
    /**
     * Start auto-orbit with an optional zoom-in first
     */
    startAutoOrbitWithZoomIn(options?: {
        zoomIn?: boolean;
        zoomDuration?: number;
        orbitDelay?: number;
        orbitTransitionDuration?: number;
    }): Promise<void>;
    /**
     * Enable or disable zoom-in on schematic load
     */
    setZoomInOnLoad(enabled: boolean, duration?: number): void;
    /**
     * Enable or disable auto-orbit after zoom
     */
    setAutoOrbitAfterZoom(enabled: boolean): void;
    /**
     * Get current zoom-in and orbit settings
     */
    getCameraSettings(): {
        enableZoomInOnLoad: boolean;
        zoomInDuration: number;
        autoOrbitAfterZoom: boolean;
        autoOrbitEnabled: boolean;
    };
    /**
     * Enhanced schematic loading that supports the zoom effect
     */
    handleSchematicLoaded(enableZoomIn?: boolean): Promise<void>;
    /**
     * Start auto-orbit from an optimal viewing position
     */
    private startAutoOrbitFromOptimalPosition;
    /**
     * Start auto-orbit with smooth transition from current camera position
     */
    startAutoOrbitSmooth(options?: {
        transitionDuration?: number;
        startFromCurrentPosition?: boolean;
        easing?: (t: number) => number;
        skipPathFitting?: boolean;
    }): void;
    /**
     * Zoom into schematics with a cinematic reveal effect
     */
    zoomInToSchematics(options?: {
        padding?: number;
        duration?: number;
        easing?: (t: number) => number;
        startDistance?: number;
        startFromCurrentPosition?: boolean;
        skipPathFitting?: boolean;
    }): Promise<void>;
    /**
     * Smoothly transition from current camera position to auto-orbit
     */
    private transitionToOrbit;
    /**
     * Find the closest point on the circular orbit to the given position
     */
    private findClosestOrbitPoint;
    /**
     * Animate camera to target position smoothly
     */
    private animateToPosition;
    private calculateSchematicBounds;
    /**
     * Calculate optimal viewing angles based on bounding box dimensions
     * AND screen aspect ratio. Maximizes the projected visible area
     * while best fitting the screen shape.
     */
    private calculateOptimalViewingAngles;
    /**
     * Calculate optimal position for perspective camera
     * Automatically selects viewing angle based on bounding box dimensions
     * to maximize the visible projected area.
     * Returns both the camera position and the optimal look-at target (which may be offset from center).
     */
    private calculatePerspectiveFraming;
    /**
     * Calculate optimal position and rotation for isometric camera
     */
    private calculateIsometricFraming;
    /**
     * Zoom directly to the final orbit position in one smooth motion
     */
    zoomToOrbitPosition(options?: {
        duration?: number;
        padding?: number;
        startFromCurrentPosition?: boolean;
        startOrbitAfterZoom?: boolean;
        easing?: (t: number) => number;
    }): Promise<void>;
    /**
     * Starts auto-orbiting the camera around the default camera path
     */
    startAutoOrbit(): void;
    /**
     * Stops the auto-orbit animation
     */
    stopAutoOrbit(): void;
    /**
     * Toggles the auto-orbit feature
     * @returns The new state of auto-orbit (true = enabled, false = disabled)
     */
    toggleAutoOrbit(): boolean;
    /**
     * Sets the auto-orbit duration
     * @param duration Duration in seconds for a full rotation
     */
    setAutoOrbitDuration(duration: number): void;
    /**
     * Gets the current state of auto-orbit
     * @returns True if auto-orbit is enabled
     */
    isAutoOrbitEnabled(): boolean;
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
    dispose(): void;
}
export {};
//# sourceMappingURL=CameraManager.d.ts.map