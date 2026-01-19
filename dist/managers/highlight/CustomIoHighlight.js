// CustomIoHighlight.ts
import * as THREE from "three";
export class CustomIoHighlight {
    constructor(schematicRenderer) {
        Object.defineProperty(this, "schematicRenderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "markers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "visible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "onCustomIoPositionsChanged", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                this.updateMarkers(data.positions);
            }
        });
        Object.defineProperty(this, "onSimulationInitialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                if (data.state && data.state.customIoPositions) {
                    this.updateMarkers(data.state.customIoPositions);
                }
            }
        });
        this.schematicRenderer = schematicRenderer;
        // Listen for custom IO position changes from SimulationManager
        this.schematicRenderer.eventEmitter.on("customIoPositionsChanged", this.onCustomIoPositionsChanged);
        this.schematicRenderer.eventEmitter.on("simulationInitialized", this.onSimulationInitialized);
    }
    activate() {
        // Initialize markers if simulation is already active
        if (this.schematicRenderer.simulationManager?.isSimulationActive()) {
            const state = this.schematicRenderer.simulationManager.getState();
            this.updateMarkers(state.customIoPositions);
        }
    }
    deactivate() {
        this.clearAllMarkers();
        this.schematicRenderer.eventEmitter.off("customIoPositionsChanged", this.onCustomIoPositionsChanged);
        this.schematicRenderer.eventEmitter.off("simulationInitialized", this.onSimulationInitialized);
    }
    setVisible(visible) {
        this.visible = visible;
        Object.values(this.markers).forEach(({ mesh, label }) => {
            mesh.visible = visible;
            label.visible = visible;
        });
    }
    update(_deltaTime) {
        // Static markers - no animation needed
    }
    updateMarkers(positions) {
        // Remove markers that are no longer in the list
        const currentKeys = Object.keys(this.markers);
        const newKeys = positions.map((p) => `${p.x},${p.y},${p.z}`);
        for (const key of currentKeys) {
            if (!newKeys.includes(key)) {
                this.removeMarker(key);
            }
        }
        // Add new markers
        for (const pos of positions) {
            this.addMarker(pos);
        }
    }
    addMarker(position) {
        const key = `${position.x},${position.y},${position.z}`;
        // Don't duplicate
        if (this.markers[key]) {
            return;
        }
        // Get the schematic's world offset
        // Schematics are usually positioned at their min coordinates
        const schematics = this.schematicRenderer.schematicManager?.getAllSchematics();
        const schematicOffset = new THREE.Vector3(0, 0, 0);
        if (schematics && schematics.length > 0) {
            // Use the first schematic's position as the offset
            const firstSchematic = schematics[0];
            schematicOffset.copy(firstSchematic.position);
        }
        // Calculate world position (schematic coordinates + offset)
        const worldPos = new THREE.Vector3(position.x + schematicOffset.x, position.y + schematicOffset.y, position.z + schematicOffset.z);
        // Create a clean cube overlay for custom IO at block size
        const size = 1.0; // Exact block size
        const cubeGeometry = new THREE.BoxGeometry(size, size, size);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88, // Cyan-green
            transparent: true,
            opacity: 0.15,
            depthTest: false, // Render on top
            depthWrite: false,
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        // Create wireframe edges for definition
        const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffaa, // Bright cyan-green
            transparent: true,
            opacity: 0.7,
            depthTest: false,
            depthWrite: false,
        });
        const wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        // Create a mesh to hold both
        const group = new THREE.Group();
        group.add(cube);
        group.add(wireframe);
        group.position.copy(worldPos);
        group.visible = this.visible;
        // Create "I/O" label sprite
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 128;
        canvas.height = 64;
        if (context) {
            // Background
            context.fillStyle = "rgba(0, 0, 0, 0.85)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            // Border with custom IO color
            context.strokeStyle = "rgb(0, 255, 136)";
            context.lineWidth = 3;
            context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
            // Text
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "rgb(0, 255, 136)";
            context.font = "bold 28px 'Courier New', monospace";
            context.fillText("I/O", canvas.width / 2, canvas.height / 2);
        }
        // Create sprite from canvas
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false, // Always render on top
            depthWrite: false,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1.0, 0.5, 1); // Compact size
        sprite.position.set(worldPos.x, worldPos.y + 1.0, worldPos.z); // Just above the block
        sprite.visible = this.visible;
        // Add to scene and store reference
        // We'll use the group as the mesh
        this.schematicRenderer.sceneManager.scene.add(group);
        this.schematicRenderer.sceneManager.scene.add(sprite);
        this.markers[key] = {
            mesh: group, // Store group as mesh
            label: sprite,
        };
    }
    removeMarker(key) {
        if (this.markers[key]) {
            this.schematicRenderer.sceneManager.scene.remove(this.markers[key].mesh);
            this.schematicRenderer.sceneManager.scene.remove(this.markers[key].label);
            // Dispose geometries and materials
            const group = this.markers[key].mesh;
            if (group && group.children) {
                group.children.forEach((child) => {
                    if (child.geometry)
                        child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((m) => m.dispose());
                        }
                        else {
                            child.material.dispose();
                        }
                    }
                });
            }
            delete this.markers[key];
        }
    }
    clearAllMarkers() {
        for (const key in this.markers) {
            this.removeMarker(key);
        }
        this.markers = {};
    }
    /**
     * Public method to add a custom IO marker at a position
     */
    addCustomIoMarker(x, y, z) {
        if (this.schematicRenderer.simulationManager) {
            this.schematicRenderer.simulationManager.addCustomIoPosition(x, y, z);
        }
    }
    /**
     * Public method to remove a custom IO marker at a position
     */
    removeCustomIoMarker(x, y, z) {
        if (this.schematicRenderer.simulationManager) {
            this.schematicRenderer.simulationManager.removeCustomIoPosition(x, y, z);
        }
    }
    /**
     * Public method to clear all custom IO markers
     */
    clearCustomIoMarkers() {
        if (this.schematicRenderer.simulationManager) {
            this.schematicRenderer.simulationManager.clearCustomIoPositions();
        }
    }
}
