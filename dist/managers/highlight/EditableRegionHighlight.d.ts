import * as THREE from "three";
import { Highlight } from "./Highlight";
import { SchematicRenderer } from "../../SchematicRenderer";
import { SelectableObject } from "../SelectableObject";
import { DefinitionRegionWrapper, SchematicWrapper } from "../../nucleationExports";
export interface EditableRegionOptions {
    name: string;
    min: {
        x: number;
        y: number;
        z: number;
    };
    max: {
        x: number;
        y: number;
        z: number;
    };
    color?: number;
    opacity?: number;
}
export declare class EditableRegionHighlight implements Highlight, SelectableObject {
    private renderer;
    name: string;
    id: string;
    group: THREE.Group;
    private baseRegion;
    private activeRegion;
    private meshes;
    private wireframes;
    private handles;
    private isActive;
    private color;
    private opacity;
    private schematicId?;
    private filters;
    constructor(renderer: SchematicRenderer, options: EditableRegionOptions & {
        schematicId?: string;
    });
    private createFaceHandles;
    getDefinitionRegion(): DefinitionRegionWrapper;
    /**
     * Recomputes the active region from base region + filters
     */
    private updateActiveRegion;
    rebuildVisuals(): void;
    private updateHandlePositions;
    getName(): string;
    activate(): void;
    deactivate(): void;
    setEditMode(enabled: boolean): void;
    edit(): void;
    remove(): boolean;
    updateLook(options: {
        color?: number;
        opacity?: number;
    }): void;
    update(_deltaTime: number): void;
    updateBoundsFromTransform(): void;
    get position(): THREE.Vector3;
    get rotation(): THREE.Euler;
    get scale(): THREE.Vector3;
    setPosition(position: THREE.Vector3): void;
    setRotation(rotation: THREE.Euler): void;
    setScale(scale: THREE.Vector3): void;
    getWorldPosition(): THREE.Vector3;
    /**
     * Returns the overall bounding box of the ACTIVE (filtered) region.
     * If the region is empty (e.g. filter matches nothing), returns empty/zero bounds.
     */
    getBounds(): {
        min: THREE.Vector3;
        max: THREE.Vector3;
    };
    /**
     * Returns array of bounding boxes for the ACTIVE (filtered) region.
     * Useful for seeing disjoint parts.
     */
    getBoundingBoxes(): Array<{
        min: THREE.Vector3;
        max: THREE.Vector3;
    }>;
    addFilter(filter: string): this;
    setFilters(filters: string[]): this;
    clearFilters(): this;
    addPoint(point: {
        x: number;
        y: number;
        z: number;
    }): this;
    getFilters(): string[];
    toDefinitionRegion(schematic?: SchematicWrapper): DefinitionRegionWrapper;
    setBounds(min: THREE.Vector3, max: THREE.Vector3): this;
    setColor(color: number): this;
    setOpacity(opacity: number): this;
    dispose(): void;
    setBaseRegion(region: DefinitionRegionWrapper): this;
}
//# sourceMappingURL=EditableRegionHighlight.d.ts.map