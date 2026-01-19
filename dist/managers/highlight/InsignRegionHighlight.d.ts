import * as THREE from "three";
import { Highlight } from "./Highlight";
import { SchematicRenderer } from "../../SchematicRenderer";
import { DslEntry } from "../../types/insign";
export type BoxPair = [[number, number, number], [number, number, number]];
export interface InsignRegionStyle {
    color: THREE.Color | number;
    opacity: number;
    linewidth: number;
    filled: boolean;
    visible: boolean;
    showLabel: boolean;
    showEdges: boolean;
    edgeThickness: number;
}
export interface InsignRegionOptions {
    regionId: string;
    entry: DslEntry;
    style?: Partial<InsignRegionStyle>;
}
/**
 * Highlight system for Insign regions - renders bounding boxes with various styles
 */
export declare class InsignRegionHighlight implements Highlight {
    private renderer;
    private regionId;
    private entry;
    private style;
    private meshes;
    private labels;
    private isActive;
    constructor(renderer: SchematicRenderer, options: InsignRegionOptions);
    getName(): string;
    /**
     * Activate the highlight - create and add meshes to the scene
     */
    activate(): void;
    /**
     * Deactivate the highlight - remove and dispose all meshes
     */
    deactivate(): void;
    /**
     * Update method required by Highlight interface
     * @param _deltaTime - Time since last frame (unused for static regions)
     */
    update(_deltaTime: number): void;
    /**
     * Update the style of this region (color, opacity, etc.)
     */
    updateStyle(newStyle: Partial<InsignRegionStyle>): void;
    /**
     * Get the region ID
     */
    getRegionId(): string;
    /**
     * Get the region entry (metadata and bounding boxes)
     */
    getEntry(): DslEntry;
    /**
     * Create a CSS2D label for a region
     */
    private createLabel;
    /**
     * Create thick border edges for a bounding box
     */
    private createThickEdges;
    /**
     * Create a mesh for a single bounding box
     */
    private createBoxMesh;
}
//# sourceMappingURL=InsignRegionHighlight.d.ts.map