import { CircularCameraPath } from "../camera/CircularCameraPath";
import * as THREE from "three";
export class CameraPathManager {
    constructor(schematicRenderer, options = {}) {
        Object.defineProperty(this, "paths", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "displayedPaths", {
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
        Object.defineProperty(this, "showVisualization", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.paths = new Map();
        this.displayedPaths = new Set();
        this.schematicRenderer = schematicRenderer;
        this.showVisualization = options.showVisualization || false;
        // Create and add initial paths
        const circularPath = new CircularCameraPath(this.schematicRenderer, {
            height: 10,
            radius: 20,
            target: new THREE.Vector3(0, 0, 0),
        });
        this.addPath("circularPath", circularPath);
        if (this.showVisualization) {
            this.showPathVisualization("circularPath");
        }
    }
    addPath(name, path) {
        this.paths.set(name, path);
    }
    getPath(name) {
        return this.paths.get(name);
    }
    removePath(name) {
        this.hidePathVisualization(name);
        this.paths.delete(name);
    }
    /**
     * Enhanced fitCircularPathToSchematics with optimal framing
     */
    fitCircularPathToSchematics(name, options = {}) {
        const path = this.paths.get(name);
        if (!(path instanceof CircularCameraPath)) {
            console.warn(`Path '${name}' is not a CircularCameraPath`);
            return;
        }
        const { padding = 0.08, // Reduced padding for tighter framing
        minRadius = 5, maxRadius = 100, heightFactor = 0.6, // Height relative to radius
        samples = 8, // Test 8 positions around the circle
         } = options;
        // Get schematic bounds
        const bounds = this.calculateSchematicBounds();
        if (!bounds) {
            console.warn("No valid schematic bounds found for fitting camera path");
            return;
        }
        const { center, size, boundingBox } = bounds;
        // Calculate optimal radius and height
        const optimalParams = this.calculateOptimalCircularPath(center, size, boundingBox, padding, minRadius, maxRadius, heightFactor, samples);
        // Update the path with optimal parameters
        path.updateParameters({
            center: optimalParams.center,
            radius: optimalParams.radius,
            height: optimalParams.height,
            target: optimalParams.target,
        });
        // Update visualization if currently displayed
        if (this.displayedPaths.has(name)) {
            this.schematicRenderer.sceneManager.removePathVisualization(`${name}Visualization`);
            const visualizationGroup = path.getVisualizationGroup();
            this.schematicRenderer.sceneManager.addPathVisualization(visualizationGroup, `${name}Visualization`);
            // Update target indicator
            const targetPosition = path.getTargetPosition();
            this.schematicRenderer.sceneManager.updateTargetIndicatorPosition(targetPosition, `${name}Target`);
        }
        console.log(`Fitted circular path '${name}' with radius: ${optimalParams.radius.toFixed(2)}, height: ${optimalParams.height.toFixed(2)}`);
        // log the parent calling the method
        console.log(`Called from: ${new Error().stack?.split("\n")[2].trim()}`);
    }
    calculateSchematicBounds() {
        if (!this.schematicRenderer.schematicManager ||
            this.schematicRenderer.schematicManager.isEmpty()) {
            return null;
        }
        // Use the tight world box for more accurate fitting
        const boundingBox = this.schematicRenderer.schematicManager.getGlobalTightWorldBox();
        if (boundingBox.isEmpty())
            return null;
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());
        return {
            center,
            size,
            boundingBox,
        };
    }
    /**
     * Calculate optimal circular path parameters using multiple sample points
     */
    calculateOptimalCircularPath(center, 
    // @ts-ignore
    size, boundingBox, padding, minRadius, maxRadius, heightFactor, samples) {
        // Get camera for FOV calculations (assume perspective camera for path fitting)
        const activeCamera = this.schematicRenderer.cameraManager.activeCamera.camera;
        let fov = 75; // Default FOV
        if (activeCamera instanceof THREE.PerspectiveCamera) {
            fov = activeCamera.fov;
        }
        const fovRad = THREE.MathUtils.degToRad(fov);
        // Calculate bounding sphere for more accurate fitting
        const boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());
        const sphereRadius = boundingSphere.radius;
        // Start with an initial radius estimate
        const optimalRadius = Math.max(sphereRadius * 2, minRadius);
        // Test different heights to find the best framing
        const testHeights = [
            sphereRadius * 0.3, // Low angle
            sphereRadius * 0.6, // Medium angle
            sphereRadius * 1.0, // High angle
            sphereRadius * 1.5, // Very high angle
        ];
        let bestRadius = optimalRadius;
        let bestHeight = sphereRadius * heightFactor;
        let smallestRequiredRadius = maxRadius;
        // Test each height to find the optimal viewing angle
        for (const testHeight of testHeights) {
            const requiredRadius = this.calculateMinimumRadius(center, boundingBox, testHeight, fovRad, padding, samples);
            if (requiredRadius <= maxRadius && requiredRadius < smallestRequiredRadius) {
                smallestRequiredRadius = requiredRadius;
                bestRadius = Math.max(requiredRadius, minRadius);
                bestHeight = testHeight;
            }
        }
        // If we couldn't fit within maxRadius, use maxRadius and adjust height
        if (smallestRequiredRadius > maxRadius) {
            bestRadius = maxRadius;
            // Calculate the height needed for this radius
            bestHeight = this.calculateOptimalHeight(center, boundingBox, bestRadius, fovRad, padding);
        }
        // Ensure the target is the center of the bounding box
        const target = center.clone();
        // The path center might be offset if the bounding box is not centered at origin
        const pathCenter = new THREE.Vector3(center.x, center.y, center.z);
        return {
            center: pathCenter,
            radius: bestRadius,
            height: bestHeight,
            target: target,
        };
    }
    /**
     * Calculate minimum radius needed to frame all schematics from a given height
     */
    calculateMinimumRadius(center, boundingBox, height, fovRad, padding, samples) {
        let maxRequiredRadius = 0;
        // Test camera positions around the circle at different angles
        for (let i = 0; i < samples; i++) {
            const angle = (i / samples) * Math.PI * 2;
            // For each angle, calculate the minimum radius needed
            const requiredRadius = this.calculateRadiusForAngle(center, boundingBox, height, angle, fovRad, padding);
            maxRequiredRadius = Math.max(maxRequiredRadius, requiredRadius);
        }
        return maxRequiredRadius;
    }
    /**
     * Calculate required radius for a specific viewing angle
     */
    calculateRadiusForAngle(center, boundingBox, height, angle, fovRad, padding) {
        // Get the canvas aspect ratio
        const canvas = this.schematicRenderer.canvas;
        const aspect = canvas.width / canvas.height;
        // Calculate camera direction
        const cameraDir = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize();
        // Project the bounding box onto the camera's view plane
        const corners = [
            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z),
        ];
        // Find the maximum extent when viewed from this angle
        let maxWidth = 0;
        let maxHeight = 0;
        // Create a temporary camera position to test visibility
        const testRadius = 50; // Arbitrary test radius
        const cameraPos = center
            .clone()
            .add(new THREE.Vector3(cameraDir.x * testRadius, height, cameraDir.z * testRadius));
        // Calculate the view direction and up vector
        const viewDir = center.clone().sub(cameraPos).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const right = viewDir.clone().cross(up).normalize();
        const actualUp = right.clone().cross(viewDir).normalize();
        // Project each corner onto the view plane
        for (const corner of corners) {
            const toCorner = corner.clone().sub(cameraPos);
            const rightComponent = toCorner.dot(right);
            const upComponent = toCorner.dot(actualUp);
            const depthComponent = toCorner.dot(viewDir);
            if (depthComponent > 0) {
                // Only consider points in front of camera
                maxWidth = Math.max(maxWidth, Math.abs(rightComponent));
                maxHeight = Math.max(maxHeight, Math.abs(upComponent));
            }
        }
        // Add padding
        maxWidth *= 1 + padding;
        maxHeight *= 1 + padding;
        // Calculate the distance needed based on FOV
        const widthDistance = maxWidth / aspect / Math.tan(fovRad / 2);
        const heightDistance = maxHeight / Math.tan(fovRad / 2);
        // Use the larger distance requirement
        const requiredDistance = Math.max(widthDistance, heightDistance);
        // Calculate the required radius using the distance and height
        const horizontalDistance = Math.sqrt(Math.max(0, requiredDistance * requiredDistance - height * height));
        return horizontalDistance;
    }
    /**
     * Calculate optimal height for a given radius
     */
    calculateOptimalHeight(
    // @ts-ignore
    center, boundingBox, radius, 
    // @ts-ignore
    fovRad, 
    // @ts-ignore
    padding) {
        const size = boundingBox.getSize(new THREE.Vector3());
        // Calculate height that provides good viewing angle
        // Generally, a height that's 30-60% of the radius works well
        const minHeight = radius * 0.3;
        const maxHeight = radius * 0.8;
        // Also consider the object's height
        const objectHeight = size.y;
        const suggestedHeight = Math.max(objectHeight * 0.5, radius * 0.5);
        // Clamp to reasonable bounds
        return Math.max(minHeight, Math.min(maxHeight, suggestedHeight));
    }
    /**
     * Create a camera path that provides cinematic views of the schematics
     */
    createCinematicPath(name, options = {}) {
        const { duration = 30, // 30 seconds
        keyFrames = 12, 
        // @ts-ignore
        heightVariation = true, 
        // @ts-ignore
        spiralEffect = false, } = options;
        const bounds = this.calculateSchematicBounds();
        if (!bounds) {
            console.warn("No schematic bounds available for cinematic path");
            return;
        }
        // This would create a more complex camera path with multiple key frames
        // and smooth transitions between different viewing angles and heights
        // Implementation would depend on having a more advanced CameraPath class
        console.log(`Creating cinematic path '${name}' with ${keyFrames} key frames over ${duration} seconds`);
    }
    updatePathParameters(name, params) {
        const path = this.paths.get(name);
        if (path) {
            path.updateParameters(params);
            if (this.displayedPaths.has(name)) {
                // Update visualization
                this.schematicRenderer.sceneManager.removePathVisualization(`${name}Visualization`);
                const visualizationGroup = path.getVisualizationGroup();
                this.schematicRenderer.sceneManager.addPathVisualization(visualizationGroup, `${name}Visualization`);
                // Update target indicator
                const targetPosition = path.getTargetPosition();
                this.schematicRenderer.sceneManager.updateTargetIndicatorPosition(targetPosition, `${name}Target`);
            }
        }
    }
    showPathVisualization(name) {
        const path = this.paths.get(name);
        if (path) {
            const visualizationGroup = path.getVisualizationGroup();
            this.schematicRenderer.sceneManager.addPathVisualization(visualizationGroup, `${name}Visualization`);
            const targetPosition = path.getTargetPosition();
            this.schematicRenderer.sceneManager.addTargetIndicator(targetPosition, `${name}Target`);
            this.displayedPaths.add(name);
        }
        else {
            console.warn(`Camera path '${name}' not found.`);
        }
    }
    hidePathVisualization(name) {
        this.schematicRenderer.sceneManager.removePathVisualization(`${name}Visualization`);
        this.schematicRenderer.sceneManager.removeTargetIndicator(`${name}Target`);
        this.displayedPaths.delete(name);
    }
    hideAllPathVisualizations() {
        this.displayedPaths.forEach((name) => {
            this.hidePathVisualization(name);
        });
    }
    getPaths() {
        return this.paths;
    }
    isPathVisible(name) {
        return this.displayedPaths.has(name);
    }
    dispose() {
        // Hide all visualizations
        this.hideAllPathVisualizations();
        // Clear all paths
        this.paths.clear();
        this.displayedPaths.clear();
    }
    getAllPathNames() {
        return Array.from(this.paths.keys());
    }
    getDefaultPath() {
        const pathNames = this.getAllPathNames();
        if (pathNames.length > 0) {
            return this.getPath(pathNames[0]);
        }
        return undefined;
    }
    getFirstPath() {
        const paths = Array.from(this.paths.entries());
        if (paths.length > 0) {
            return { path: paths[0][1], name: paths[0][0] };
        }
        return null;
    }
}
