import * as THREE from "three";
import { CameraPath } from "./CameraPath";
export class CircularCameraPath extends CameraPath {
    constructor(schematicRenderer, params) {
        super();
        Object.defineProperty(this, "params", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "targetVec", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "centerOffsetVec", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "startAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "endAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "schematicRenderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.schematicRenderer = schematicRenderer;
        this.params = {
            ...params,
            centerOffset: params.centerOffset || [0, 0, 0],
        };
        this.targetVec = this.vectorFromInput(params.target);
        this.centerOffsetVec = this.vectorFromInput(params.centerOffset || [0, 0, 0]);
        this.startAngle = params.startAngle || 0;
        this.endAngle = params.endAngle || Math.PI * 2;
        this.updatePathFunction();
    }
    vectorFromInput(input) {
        if (Array.isArray(input)) {
            return new THREE.Vector3(...input);
        }
        return input.clone();
    }
    updatePathFunction() {
        const { height, radius } = this.params;
        this.pathFunction = (t) => {
            // Calculate the current angle
            const angle = this.startAngle + (this.endAngle - this.startAngle) * t;
            // Calculate position on circle
            const position = new THREE.Vector3(this.centerOffsetVec.x + radius * Math.cos(angle), this.centerOffsetVec.y + height, this.centerOffsetVec.z + radius * Math.sin(angle));
            // Calculate rotation to look at target
            const lookAtMatrix = new THREE.Matrix4();
            const up = new THREE.Vector3(0, 1, 0);
            lookAtMatrix.lookAt(position, this.targetVec, up);
            const rotation = new THREE.Euler().setFromRotationMatrix(lookAtMatrix);
            return {
                position: position,
                rotation: rotation,
                target: this.targetVec.clone(),
            };
        };
    }
    animate(options) {
        const startTime = performance.now();
        let lastT = 0;
        const animate = () => {
            const elapsed = performance.now() - startTime;
            const t = Math.min(elapsed / (options.duration * 1000), 1);
            if (Math.abs(t - lastT) > 0.001) {
                const frame = this.pathFunction(t);
                options.onFrame({ ...frame, progress: t });
                lastT = t;
            }
            if (t < 1) {
                requestAnimationFrame(animate);
            }
            else if (options.onComplete) {
                options.onComplete();
            }
        };
        animate();
    }
    fitToSchematics() {
        if (!this.schematicRenderer.schematicManager) {
            return;
        }
        const schematicCenters = this.schematicRenderer.schematicManager.getSchematicsAveragePosition();
        const cameraPosition = this.schematicRenderer.cameraManager.activeCamera
            .position;
        // Set target and height
        this.params.target = schematicCenters;
        // this.targetVec = this.vectorFromInput(schematicCenters);
        this.params.height = cameraPosition.y;
        // Calculate radius from horizontal distance
        const distance = cameraPosition.distanceTo(schematicCenters);
        this.params.radius = distance;
        // Calculate current angle in XZ plane relative to center
        const deltaX = cameraPosition.x - schematicCenters.x;
        const deltaZ = cameraPosition.z - schematicCenters.z;
        const currentAngle = Math.atan2(deltaZ, deltaX);
        // Set the startAngle to match current camera position
        this.startAngle = currentAngle;
        this.endAngle = currentAngle + Math.PI * 2; // Full circle from current position
        this.updatePathFunction();
    }
    updateParameters(params) {
        if (params.target) {
            this.targetVec = this.vectorFromInput(params.target);
        }
        if (params.centerOffset) {
            this.centerOffsetVec = this.vectorFromInput(params.centerOffset);
        }
        if (params.startAngle !== undefined) {
            this.startAngle = params.startAngle;
        }
        if (params.endAngle !== undefined) {
            this.endAngle = params.endAngle;
        }
        Object.assign(this.params, params);
        this.updatePathFunction();
    }
    // Override getVisualizationGroup to add center and target indicators
    getVisualizationGroup(segments = 100) {
        const group = super.getVisualizationGroup(segments);
        // Add center point indicator
        const centerGeometry = new THREE.SphereGeometry(0.2);
        const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const centerPoint = new THREE.Mesh(centerGeometry, centerMaterial);
        centerPoint.position.copy(this.centerOffsetVec);
        group.add(centerPoint);
        // Add target point indicator
        const targetGeometry = new THREE.SphereGeometry(0.2);
        const targetMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const targetPoint = new THREE.Mesh(targetGeometry, targetMaterial);
        targetPoint.position.copy(this.targetVec);
        group.add(targetPoint);
        return group;
    }
    /**
     * Get the center point of the circular path
     */
    getCenter() {
        return this.centerOffsetVec.clone();
    }
    /**
     * Get the radius of the circular path
     */
    getRadius() {
        return this.params.radius;
    }
    /**
     * Get the height of the circular path
     */
    getHeight() {
        return this.params.height;
    }
    /**
     * Set the starting angle for the orbit
     */
    setStartAngle(angle) {
        this.startAngle = angle;
        this.endAngle = angle + Math.PI * 2; // Full circle from new start position
        this.updatePathFunction();
    }
    /**
     * Get the starting angle of the orbit
     */
    getStartAngle() {
        return this.startAngle;
    }
    /**
     * Get the current angle at parameter t
     */
    getCurrentAngle(t) {
        return this.startAngle + (this.endAngle - this.startAngle) * t;
    }
    /**
     * Get the target position the path is looking at
     */
    getTargetPosition() {
        return this.targetVec.clone();
    }
    /**
     * Update the target that the camera looks at during orbit
     */
    setTarget(target) {
        this.targetVec = this.vectorFromInput(target);
        this.params.target = target;
        this.updatePathFunction();
    }
}
