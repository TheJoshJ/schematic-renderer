import * as THREE from "three";
import { SchematicObject } from "./SchematicObject";
import { matchesShortcut } from "../ui/UIComponents";
export class InteractionManager {
    constructor(schematicRenderer, options) {
        Object.defineProperty(this, "schematicRenderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "raycaster", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mouse", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "camera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hoveredObject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "selectedObject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "gizmoShortcuts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.schematicRenderer = schematicRenderer;
        this.options = {
            ...options,
            enableKeyboardShortcuts: options.enableKeyboardShortcuts ?? true,
        };
        // Set default gizmo shortcuts
        this.gizmoShortcuts = {
            translate: options.gizmoShortcuts?.translate ?? "KeyG",
            rotate: options.gizmoShortcuts?.rotate ?? "KeyR",
            scale: options.gizmoShortcuts?.scale ?? "KeyS",
            deselect: options.gizmoShortcuts?.deselect ?? "Escape",
        };
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = this.schematicRenderer.cameraManager.activeCamera.camera;
        this.canvas = this.schematicRenderer.canvas;
        this.addEventListeners();
    }
    addEventListeners() {
        // Only add event listeners if the corresponding functionality is enabled
        if (this.options.enableSelection) {
            this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
            this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
            window.addEventListener("keydown", this.onKeyDown.bind(this));
        }
        // Listen for external selection events (e.g. from RegionManager) to keep state in sync
        this.schematicRenderer.eventEmitter.on("objectSelected", (object) => {
            if (this.selectedObject !== object) {
                this.selectedObject = object;
                console.log("InteractionManager synced selection:", object.id);
            }
        });
        this.schematicRenderer.eventEmitter.on("objectDeselected", () => {
            if (this.selectedObject) {
                this.selectedObject = null;
            }
        });
    }
    onMouseMove(event) {
        if (!this.options.enableSelection)
            return;
        this.updateMousePosition(event);
        // Uncomment if hover functionality is needed
        // this.checkHover();
    }
    onMouseDown(event) {
        if (!this.options.enableSelection)
            return;
        this.updateMousePosition(event);
        this.checkSelection();
    }
    onKeyDown(event) {
        if (!this.options.enableMovingSchematics)
            return;
        if (this.options.enableKeyboardShortcuts === false)
            return;
        // Check for gizmo mode shortcuts
        if (matchesShortcut(event, this.gizmoShortcuts.translate)) {
            this.schematicRenderer.gizmoManager?.setMode("translate");
        }
        else if (matchesShortcut(event, this.gizmoShortcuts.rotate)) {
            this.schematicRenderer.gizmoManager?.setMode("rotate");
        }
        else if (matchesShortcut(event, this.gizmoShortcuts.scale)) {
            this.schematicRenderer.gizmoManager?.setMode("scale");
        }
        else if (matchesShortcut(event, this.gizmoShortcuts.deselect)) {
            this.deselectObject();
        }
    }
    updateMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    // @ts-ignore
    checkHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const selectableObjects = this.schematicRenderer.schematicManager?.getSelectableObjects();
        if (!selectableObjects || selectableObjects.length === 0) {
            console.warn("No selectable objects found");
            return;
        }
        // Filter out any undefined objects
        const validObjects = selectableObjects.filter((obj) => obj !== undefined);
        if (validObjects.length !== selectableObjects.length) {
            console.warn(`Filtered out ${selectableObjects.length - validObjects.length} undefined objects`);
        }
        try {
            const intersects = this.raycaster.intersectObjects(validObjects, true);
            if (intersects.length > 0) {
                const intersectedObject = intersects[0].object;
                const selectableObject = this.findSelectableParent(intersectedObject);
                if (selectableObject && selectableObject !== this.hoveredObject) {
                    if (this.hoveredObject) {
                        this.schematicRenderer.eventEmitter.emit("hoverExit", this.hoveredObject);
                    }
                    this.hoveredObject = selectableObject;
                    this.schematicRenderer.eventEmitter.emit("hoverEnter", selectableObject, intersects[0]);
                    console.log("Hovering over object", selectableObject.id);
                }
            }
            else if (this.hoveredObject) {
                this.schematicRenderer.eventEmitter.emit("hoverExit", this.hoveredObject);
                this.hoveredObject = null;
            }
        }
        catch (error) {
            // console.error("Error in checkHover:", error);
            // console.log("Camera:", this.camera);
            // console.log("Mouse:", this.mouse);
            // console.log("Valid objects:", validObjects);
        }
    }
    findSelectableParent(object) {
        let current = object;
        while (current) {
            if (current instanceof THREE.Group && current.name) {
                const schematic = this.schematicRenderer.schematicManager?.getSchematic(current.name);
                if (schematic) {
                    console.log("Found selectable parent:", schematic.id);
                    return schematic;
                }
            }
            current = current.parent;
        }
        console.log("No selectable parent found");
        return null;
    }
    // @ts-ignore
    visualizeBoundingBoxes() {
        const selectableObjects = this.schematicRenderer.schematicManager?.getSelectableObjects();
        if (!selectableObjects) {
            console.warn("No selectable objects found");
            return;
        }
        selectableObjects.forEach((object) => {
            const box = new THREE.Box3().setFromObject(object);
            const helper = new THREE.Box3Helper(box, new THREE.Color(0xffff00));
            this.schematicRenderer.sceneManager.scene.add(helper);
            console.log("Object:", object.name);
            console.log("  Position:", object.position);
            console.log("  Scale:", object.scale);
            console.log("  Bounding box min:", box.min);
            console.log("  Bounding box max:", box.max);
            console.log("  Bounding box size:", box.getSize(new THREE.Vector3()));
        });
        console.log("Added bounding box visualizations");
    }
    checkSelection() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const selectableObjects = this.schematicRenderer.schematicManager?.getSelectableObjects();
        if (!selectableObjects?.length) {
            console.warn("No selectable objects available");
            return;
        }
        // Verify objects are in scene
        const validObjects = selectableObjects.filter((obj) => this.schematicRenderer.sceneManager.scene.getObjectById(obj.id));
        const intersects = this.raycaster.intersectObjects(validObjects, true);
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            // Check if we hit a region handle (prevent main selection logic from overriding handle drag)
            if (intersectedObject.userData && intersectedObject.userData.isHandle) {
                return;
            }
            const selectableObject = this.findSelectableParent(intersectedObject);
            // Prevent selecting regions via click (they should be edited via API/UI)
            if (selectableObject &&
                (selectableObject.id?.startsWith("region_") ||
                    selectableObject.name?.startsWith("region_") ||
                    selectableObject.group?.name?.startsWith("region_"))) {
                return;
            }
            if (selectableObject) {
                // Don't auto-edit regions on simple click unless we implement a specific double-click or UI button
                // However, if we select it, we want the gizmo to attach.
                // Ensure that if it is a region, we don't accidentally force handles visible if they weren't
                // NEW: If currently selected object is a Region, and the new object is a Schematic,
                // assume the user is interacting with the schematic content (placing/breaking/toggling)
                // while keeping the region active.
                if (this.selectedObject &&
                    this.selectedObject.id?.startsWith("region_") &&
                    selectableObject instanceof SchematicObject) {
                    console.log("Ignoring selection change from Region to Schematic (preserving region context)");
                    return; // Don't switch selection to schematic
                }
                this.selectObject(selectableObject);
            }
        }
        else {
            // this.deselectObject();
        }
    }
    selectObject(object) {
        if (this.selectedObject !== object) {
            this.deselectObject(); // Deselect previous object if any
            this.selectedObject = object;
            this.schematicRenderer.eventEmitter.emit("objectSelected", object);
            console.log("Selected object:", object.id);
        }
    }
    deselectObject() {
        if (this.selectedObject) {
            this.schematicRenderer.gizmoManager?.detach();
            this.schematicRenderer.eventEmitter.emit("objectDeselected", this.selectedObject);
            this.selectedObject = null;
        }
    }
    update() {
        // This method can be called in the render loop if continuous updates are needed
    }
    dispose() {
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
        this.canvas.removeEventListener("mousedown", this.onMouseDown);
    }
}
