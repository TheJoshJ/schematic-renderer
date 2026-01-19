import * as THREE from "three";
export declare abstract class CameraPath {
    protected pathFunction: (t: number) => {
        position: THREE.Vector3;
        rotation: THREE.Euler;
        target: THREE.Vector3;
    };
    constructor();
    getPoint(t: number): {
        position: THREE.Vector3;
        rotation: THREE.Euler;
        target: THREE.Vector3;
    };
    getTargetPosition(): THREE.Vector3;
    getVisualizationGroup(segments?: number): THREE.Group;
    abstract updateParameters(params: any): void;
}
//# sourceMappingURL=CameraPath.d.ts.map