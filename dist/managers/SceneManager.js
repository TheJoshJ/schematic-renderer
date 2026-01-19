// managers/SceneManager.ts
import * as THREE from "three";
import { EventEmitter } from "events";
import { Grid } from "./helpers/Grid";
import { Axes } from "./helpers/Axes";
export class SceneManager extends EventEmitter {
    constructor(schematicRenderer) {
        super();
        Object.defineProperty(this, "schematicRenderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gridHelper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "axesHelper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_showGrid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_showAxes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lights", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.schematicRenderer = schematicRenderer;
        this.scene = new THREE.Scene();
        this._showGrid = this.schematicRenderer.options.showGrid ?? false;
        this._showAxes = this.schematicRenderer.options.showAxes ?? false;
        //if the scene has a background color set, use it
        if (this.schematicRenderer.options.backgroundColor) {
            this.setBackgroundColor(this.schematicRenderer.options.backgroundColor);
        }
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
        this.scene.add(ambientLight);
        this.lights.set("ambientLight", ambientLight);
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(20, 20, -20);
        this.scene.add(directionalLight);
        this.lights.set("directionalLight", directionalLight);
    }
    get showGrid() {
        return this._showGrid;
    }
    set showGrid(value) {
        this._showGrid = value;
        this.updateHelpers();
    }
    get showAxes() {
        return this._showAxes;
    }
    set showAxes(value) {
        this._showAxes = value;
        this.updateHelpers();
    }
    updateHelpers() {
        this.toggleGrid(this._showGrid);
        this.toggleAxes(this._showAxes);
    }
    addCameraHelper(camera, name) {
        const helper = new THREE.CameraHelper(camera);
        helper.name = name;
        this.scene.add(helper);
    }
    removeCameraHelper(name) {
        const helper = this.scene.getObjectByName(name);
        if (helper) {
            this.scene.remove(helper);
        }
    }
    // Method to add a target indicator
    addTargetIndicator(position, name = "targetIndicator") {
        // Remove existing target indicator if any
        this.removeTargetIndicator(name);
        // Create a visual representation of the target (e.g., a sphere)
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow color
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(position);
        sphere.name = name;
        // Add the sphere to the scene
        this.scene.add(sphere);
    }
    // Method to remove the target indicator
    removeTargetIndicator(name = "targetIndicator") {
        const object = this.scene.getObjectByName(name);
        if (object) {
            this.scene.remove(object);
        }
    }
    // Optional: Method to update the target indicator position
    updateTargetIndicatorPosition(position, name = "targetIndicator") {
        const object = this.scene.getObjectByName(name);
        if (object) {
            object.position.copy(position);
        }
    }
    addPathVisualization(group, name) {
        group.name = name;
        this.scene.add(group);
    }
    removePathVisualization(name) {
        const object = this.scene.getObjectByName(name);
        if (object) {
            this.scene.remove(object);
        }
    }
    // Light Management Methods
    addLight(name, light) {
        if (this.lights.has(name)) {
            console.warn(`Light with name '${name}' already exists.`);
            return;
        }
        this.scene.add(light);
        this.lights.set(name, light);
        this.emit("lightAdded", { name, light });
    }
    removeLight(name) {
        const light = this.lights.get(name);
        if (light) {
            this.scene.remove(light);
            this.lights.delete(name);
            this.emit("lightRemoved", { name });
        }
        else {
            console.warn(`Light with name '${name}' does not exist.`);
        }
    }
    updateLight(name, properties) {
        const light = this.lights.get(name);
        if (light) {
            Object.assign(light, properties);
            this.emit("lightUpdated", { name, light });
        }
        else {
            console.warn(`Light with name '${name}' does not exist.`);
        }
    }
    getLights() {
        return this.lights;
    }
    toggleGrid(show) {
        if (show && !this.gridHelper) {
            this.gridHelper = new Grid(this.schematicRenderer.cameraManager.activeCamera.camera);
            // EXCLUDE GRID FROM SSAO - This prevents artifacts!
            this.gridHelper.userData.cannotReceiveAO = true;
            this.gridHelper.userData.treatAsOpaque = false;
            // If the grid has children, apply to them too
            this.gridHelper.traverse((child) => {
                child.userData.cannotReceiveAO = true;
                child.userData.treatAsOpaque = false;
            });
            this.scene.add(this.gridHelper);
        }
        else if (!show && this.gridHelper) {
            this.scene.remove(this.gridHelper);
            this.gridHelper = null;
        }
    }
    toggleAxes(show) {
        if (show && !this.axesHelper) {
            this.axesHelper = new Axes(5, this.schematicRenderer.cameraManager.activeCamera.camera);
            // EXCLUDE AXES FROM SSAO TOO
            this.axesHelper.userData.cannotReceiveAO = true;
            this.axesHelper.userData.treatAsOpaque = false;
            // Apply to children
            this.axesHelper.traverse((child) => {
                child.userData.cannotReceiveAO = true;
                child.userData.treatAsOpaque = false;
            });
            this.scene.add(this.axesHelper);
        }
        else if (!show && this.axesHelper) {
            this.scene.remove(this.axesHelper);
            this.axesHelper = null;
        }
    }
    addDebugCuboide(position, size, color) {
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.copy(position);
        this.scene.add(cube);
    }
    addDebugBoundingBox(position, size, color) {
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color }));
        line.position.copy(position);
        this.scene.add(line);
    }
    addDebugText(text, position, color = 0x000000, backgroundColor = 0xffffff) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
            context.font = "Bold 40px Arial";
            context.fillStyle = "rgba(" + backgroundColor + ", 1)";
            context.fillRect(0, 0, context.measureText(text).width, 50);
            context.fillStyle = "rgba(" + color + ", 1)";
            context.fillText(text, 0, 40);
        }
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(5, 2, 1);
        this.scene.add(sprite);
    }
    removeObject(name) {
        const object = this.scene.getObjectByName(name);
        if (object) {
            this.scene.remove(object);
            // Dispose resources
            if (object instanceof THREE.Mesh) {
                if (object.geometry)
                    object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach((m) => m.dispose());
                }
                else {
                    object.material.dispose();
                }
            }
            this.emit("objectRemoved", { name });
        }
    }
    getObjectByName(name) {
        return this.scene.getObjectByName(name);
    }
    getAllObjects() {
        const objects = [];
        this.scene.traverse((child) => {
            objects.push(child);
        });
        return objects;
    }
    // Overriding the add method to set object names if provided
    add(object, name) {
        if (name)
            object.name = name;
        this.scene.add(object);
        this.emit("objectAdded", { name: object.name, object });
    }
    // Scene Settings Methods
    setBackgroundColor(color) {
        this.scene.background = new THREE.Color(color);
        this.emit("backgroundColorChanged", { color });
    }
    setFog(fog) {
        this.scene.fog = fog;
        this.emit("fogChanged", { fog });
    }
    setEnvironmentMap(envMap) {
        this.scene.environment = envMap;
        this.emit("environmentMapChanged", { envMap });
    }
    addSchematic(schematic) {
        this.scene.add(schematic.group);
        this.emit("schematicAdded", schematic);
    }
    removeSchematic(schematic) {
        this.scene.remove(schematic.group);
        this.emit("schematicRemoved", schematic);
    }
}
