// camera/CameraPath.ts
import * as THREE from "three";
export class CameraPath {
    constructor() {
        Object.defineProperty(this, "pathFunction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.pathFunction = (_) => {
            return {
                position: new THREE.Vector3(),
                rotation: new THREE.Euler(),
                target: new THREE.Vector3(),
            };
        };
    }
    getPoint(t) {
        return this.pathFunction(t);
    }
    getTargetPosition() {
        // Assuming the target is constant for the path
        return this.getPoint(0).target.clone();
    }
    getVisualizationGroup(segments = 100) {
        const group = new THREE.Group();
        // Generate path curve
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const { position } = this.getPoint(t);
            points.push(position);
        }
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const pathMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const pathLine = new THREE.Line(pathGeometry, pathMaterial);
        group.add(pathLine);
        // Generate arrows
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const { position, target } = this.getPoint(t);
            const direction = target.clone().sub(position).normalize();
            const arrow = new THREE.ArrowHelper(direction, position, 1, 0xff0000, 0.2, 0.1);
            group.add(arrow);
        }
        return group;
    }
}
