import * as THREE from "three";
import { EventEmitter } from "events";
import { SchematicRenderer } from "../SchematicRenderer";
export declare class CameraWrapper extends EventEmitter {
    private schematicRenderer;
    private _camera;
    private _type;
    private rendererDomElement;
    constructor(type: "perspective" | "orthographic", rendererDomElement: HTMLCanvasElement, schematicRenderer: SchematicRenderer, params?: any);
    get camera(): THREE.Camera;
    get fov(): number;
    set fov(value: number);
    get position(): THREE.Vector3 | THREE.Vector3Tuple | Array<number>;
    set position(value: THREE.Vector3 | THREE.Vector3Tuple | Array<number>);
    get rotation(): THREE.Euler | [number, number, number];
    set rotation(value: THREE.Euler | [number, number, number]);
    updateAspectRatio(aspect: number): void;
    createControls(type: "orbit" | "creative" | any): any;
    setPosition(position: THREE.Vector3 | THREE.Vector3Tuple): void;
    lookAt(target: THREE.Vector3 | THREE.Vector3Tuple): void;
    setPositionLookAt(position: THREE.Vector3 | THREE.Vector3Tuple, target: THREE.Vector3 | THREE.Vector3Tuple): void;
    changeType(type: "perspective" | "orthographic"): void;
}
//# sourceMappingURL=CameraWrapper.d.ts.map