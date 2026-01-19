import * as THREE from "three";
import { Highlight } from "./Highlight";
import { SchematicRenderer } from "../../SchematicRenderer";
import { DslEntry } from "../../types/insign";
export type BoxPair = [[number, number, number], [number, number, number]];
export interface InsignIoStyle {
    color: THREE.Color | number;
    opacity: number;
    filled: boolean;
    visible: boolean;
    showLabel: boolean;
    showEdges: boolean;
    edgeThickness: number;
    showBitNumbers: boolean;
    showDataType: boolean;
    showPositionCount: boolean;
    highlightFirstBit: boolean;
}
export interface InsignIoOptions {
    regionId: string;
    entry: DslEntry;
    positions: Array<[number, number, number]>;
    dataType: string;
    ioDirection: "input" | "output";
    style?: Partial<InsignIoStyle>;
}
/**
 * Specialized highlight for Insign IO regions with enhanced visualization
 * Shows individual bit positions, data types, and direction
 */
export declare class InsignIoHighlight implements Highlight {
    private renderer;
    private regionId;
    private positions;
    private dataType;
    private ioDirection;
    private style;
    private meshes;
    private labels;
    private bitLabels;
    private isActive;
    constructor(renderer: SchematicRenderer, options: InsignIoOptions);
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
     * Update the highlight (called each frame)
     */
    update(_deltaTime: number): void;
    /**
     * Update the style of the highlight
     */
    updateStyle(newStyle: Partial<InsignIoStyle>): void;
    /**
     * Create a highlight mesh for a single block position
     */
    private createBlockHighlight;
    /**
     * Create thick edges around a block
     */
    private createThickEdges;
    /**
     * Create a bit number label for a position
     */
    private createBitLabel;
    /**
     * Create the main label for the IO region
     */
    private createMainLabel;
    /**
     * Calculate the center position of all IO positions
     */
    private calculateCenterPosition;
    /**
     * Get the IO direction
     */
    getDirection(): "input" | "output";
    /**
     * Get the data type
     */
    getDataType(): string;
    /**
     * Get the number of positions (bits)
     */
    getPositionCount(): number;
    /**
     * Get all positions
     */
    getPositions(): Array<[number, number, number]>;
}
//# sourceMappingURL=InsignIoHighlight.d.ts.map