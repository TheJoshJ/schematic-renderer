// HoverHighlight.ts
import * as THREE from "three";
export class HoverHighlight {
    constructor(schematicRenderer) {
        Object.defineProperty(this, "schematicRenderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hoverMesh", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // @ts-ignore
        Object.defineProperty(this, "raycaster", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // @ts-ignore
        Object.defineProperty(this, "mouse", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastHoveredObject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "onHoverEnter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (object, intersect) => {
                this.removeHoverMesh();
                this.lastHoveredObject = object;
                console.log("Hovering over object", object);
                const position = new THREE.Vector3();
                position.copy(intersect.point).floor();
                // Create the hover mesh and center it within the block
                const geometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
                const material = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    opacity: 0.2,
                    transparent: true,
                });
                this.hoverMesh = new THREE.Mesh(geometry, material);
                this.hoverMesh.position.copy(position).addScalar(0.5); // Center the mesh
                this.hoverMesh.userData.isHighlight = true;
                this.schematicRenderer.sceneManager.add(this.hoverMesh);
                // Emit an event with the position and face normal
                this.schematicRenderer.eventEmitter.emit("hover", {
                    object,
                    position,
                    faceNormal: intersect.face?.normal.clone().transformDirection(intersect.object.matrixWorld),
                });
            }
        });
        Object.defineProperty(this, "onHoverExit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (object) => {
                if (object === this.lastHoveredObject) {
                    this.removeHoverMesh();
                    this.lastHoveredObject = null;
                    this.schematicRenderer.eventEmitter.emit("hover", null);
                }
            }
        });
        this.schematicRenderer = schematicRenderer;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        // Bind the methods to ensure correct 'this' context
        this.onHoverEnter = this.onHoverEnter.bind(this);
        this.onHoverExit = this.onHoverExit.bind(this);
    }
    activate() {
        console.log("HoverHighlight activated");
        this.schematicRenderer.eventEmitter.on("hoverEnter", this.onHoverEnter);
        this.schematicRenderer.eventEmitter.on("hoverExit", this.onHoverExit);
    }
    deactivate() {
        console.log("HoverHighlight deactivated");
        this.schematicRenderer.eventEmitter.off("hoverEnter", this.onHoverEnter);
        this.schematicRenderer.eventEmitter.off("hoverExit", this.onHoverExit);
        this.removeHoverMesh();
    }
    // @ts-ignore
    update(deltaTime) {
        // No periodic update needed for hover effect
    }
    removeHoverMesh() {
        if (this.hoverMesh) {
            this.schematicRenderer.sceneManager.scene.remove(this.hoverMesh);
            this.hoverMesh = null;
        }
    }
    // @ts-ignore
    getBlockData(position) {
        // Access the schematic to get block data
        if (!this.schematicRenderer.schematicManager)
            return null;
        const firstSchematic = this.schematicRenderer.schematicManager.getAllSchematics()[0];
        if (!firstSchematic)
            return null;
        const block = firstSchematic.schematicWrapper.get_block_with_properties(position.x, position.y, position.z);
        if (block) {
            const blockEntity = firstSchematic.schematicWrapper.get_block_entity(position.x, position.y, position.z);
            return {
                name: block.name(),
                properties: block.properties(),
                blockEntity,
            };
        }
        return null;
    }
}
