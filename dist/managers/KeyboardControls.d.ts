import * as THREE from "three";
import { KeyboardControlsOptions } from "../SchematicRendererOptions";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export declare class KeyboardControls {
    private enabled;
    private flySpeed;
    private sprintMultiplier;
    private keybinds;
    private pressedKeys;
    private isRightMouseDown;
    private camera;
    private orbitControls;
    private canvas;
    private velocity;
    private direction;
    constructor(camera: THREE.Camera, canvas: HTMLCanvasElement, options?: KeyboardControlsOptions);
    /**
     * Set the orbit controls reference to enable/disable them during keyboard movement
     */
    setOrbitControls(controls: OrbitControls | null): void;
    /**
     * Update fly speed at runtime
     */
    setFlySpeed(speed: number): void;
    /**
     * Get current fly speed
     */
    getFlySpeed(): number;
    /**
     * Update sprint multiplier at runtime
     */
    setSprintMultiplier(multiplier: number): void;
    /**
     * Enable or disable keyboard controls
     */
    setEnabled(enabled: boolean): void;
    /**
     * Check if keyboard controls are enabled
     */
    isEnabled(): boolean;
    private bindEvents;
    private onKeyDown;
    private onKeyUp;
    private onMouseDown;
    private onMouseUp;
    private onContextMenu;
    private onBlur;
    /**
     * Check if a specific key is pressed
     */
    private isKeyPressed;
    /**
     * Update camera position based on keyboard input
     * Should be called every frame with deltaTime
     */
    update(deltaTime: number): void;
    /**
     * Clean up event listeners
     */
    dispose(): void;
}
//# sourceMappingURL=KeyboardControls.d.ts.map