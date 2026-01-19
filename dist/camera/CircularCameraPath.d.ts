import * as THREE from "three";
import { CameraPath } from "./CameraPath";
import { SchematicRenderer } from "../SchematicRenderer";
import { CameraFrame } from "../managers/CameraManager";
interface CircularPathParams {
    center?: THREE.Vector3 | number[];
    height: number;
    radius: number;
    target: THREE.Vector3 | number[];
    centerOffset?: THREE.Vector3 | number[];
    startAngle?: number;
    endAngle?: number;
}
export declare class CircularCameraPath extends CameraPath {
    private params;
    private targetVec;
    private centerOffsetVec;
    private startAngle;
    private endAngle;
    private schematicRenderer;
    constructor(schematicRenderer: SchematicRenderer, params: CircularPathParams);
    private vectorFromInput;
    private updatePathFunction;
    animate(options: {
        duration: number;
        onFrame: (frame: CameraFrame) => void;
        onComplete?: () => void;
    }): void;
    fitToSchematics(): void;
    updateParameters(params: Partial<CircularPathParams>): void;
    getVisualizationGroup(segments?: number): THREE.Group;
    /**
     * Get the center point of the circular path
     */
    getCenter(): THREE.Vector3;
    /**
     * Get the radius of the circular path
     */
    getRadius(): number;
    /**
     * Get the height of the circular path
     */
    getHeight(): number;
    /**
     * Set the starting angle for the orbit
     */
    setStartAngle(angle: number): void;
    /**
     * Get the starting angle of the orbit
     */
    getStartAngle(): number;
    /**
     * Get the current angle at parameter t
     */
    getCurrentAngle(t: number): number;
    /**
     * Get the target position the path is looking at
     */
    getTargetPosition(): THREE.Vector3;
    /**
     * Update the target that the camera looks at during orbit
     */
    setTarget(target: THREE.Vector3 | number[]): void;
}
export {};
//# sourceMappingURL=CircularCameraPath.d.ts.map