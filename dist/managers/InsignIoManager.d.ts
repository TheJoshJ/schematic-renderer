import { EventEmitter } from "events";
import { SchematicRenderer } from "../SchematicRenderer";
import { InsignIoStyle } from "./highlight/InsignIoHighlight";
import { DslMap, DslEntry } from "../types/insign";
export interface InsignIoRegion {
    regionId: string;
    entry: DslEntry;
    positions: Array<[number, number, number]>;
    dataType: string;
    ioDirection: "input" | "output";
    sortStrategy?: string;
}
export interface InsignIoFilter {
    /** Filter by IO direction */
    direction?: "input" | "output";
    /** Filter by data type pattern (e.g., 'unsigned', 'signed:8') */
    dataTypePattern?: string;
    /** Filter by minimum bit count */
    minBits?: number;
    /** Filter by maximum bit count */
    maxBits?: number;
}
/**
 * Manager for Insign IO regions - provides high-level API for visualizing
 * TypedCircuitExecutor IO layouts parsed from Insign annotations
 */
export declare class InsignIoManager extends EventEmitter {
    private renderer;
    private ioRegions;
    private activeHighlights;
    constructor(renderer: SchematicRenderer);
    /**
     * Parse IO regions from Insign data
     * Looks for regions starting with 'io.' and extracts IO metadata
     */
    parseFromInsign(dslMap: DslMap): Promise<void>;
    /**
     * Extract block positions from bounding boxes
     * TODO: This should call Nucleation's extract_redstone_positions with proper sorting
     */
    private extractPositionsFromBoundingBoxes;
    /**
     * Load and parse IO regions from the current schematic
     */
    loadFromSchematic(schematicName?: string): Promise<void>;
    /**
     * Get all IO region IDs
     */
    getAllRegionIds(): string[];
    /**
     * Get filtered IO regions
     */
    getFilteredRegions(filter: InsignIoFilter): InsignIoRegion[];
    /**
     * Show an IO region with optional custom style
     */
    showRegion(regionId: string, style?: Partial<InsignIoStyle>): void;
    /**
     * Show multiple IO regions
     */
    showRegions(regionIds: string[], style?: Partial<InsignIoStyle>): void;
    /**
     * Show filtered IO regions
     */
    showFilteredRegions(filter: InsignIoFilter, style?: Partial<InsignIoStyle>): void;
    /**
     * Show all IO regions
     */
    showAllRegions(style?: Partial<InsignIoStyle>): void;
    /**
     * Show all inputs
     */
    showAllInputs(style?: Partial<InsignIoStyle>): void;
    /**
     * Show all outputs
     */
    showAllOutputs(style?: Partial<InsignIoStyle>): void;
    /**
     * Hide an IO region
     */
    hideRegion(regionId: string): void;
    /**
     * Hide multiple IO regions
     */
    hideRegions(regionIds: string[]): void;
    /**
     * Hide filtered IO regions
     */
    hideFilteredRegions(filter: InsignIoFilter): void;
    /**
     * Hide all IO regions
     */
    hideAllRegions(): void;
    /**
     * Toggle an IO region's visibility
     */
    toggleRegion(regionId: string, style?: Partial<InsignIoStyle>): void;
    /**
     * Update the style of an active region
     */
    updateRegionStyle(regionId: string, style: Partial<InsignIoStyle>): void;
    /**
     * Check if a region is currently visible
     */
    isRegionVisible(regionId: string): boolean;
    /**
     * Get all currently visible region IDs
     */
    getVisibleRegionIds(): string[];
    /**
     * Get an IO region's data
     */
    getRegion(regionId: string): InsignIoRegion | null;
    /**
     * Get all input regions
     */
    getAllInputs(): InsignIoRegion[];
    /**
     * Get all output regions
     */
    getAllOutputs(): InsignIoRegion[];
    /**
     * Get statistics about IO regions
     */
    getStatistics(): {
        totalRegions: number;
        inputs: number;
        outputs: number;
        totalInputBits: number;
        totalOutputBits: number;
        dataTypes: Record<string, number>;
    };
    /**
     * Clear all data and hide all regions
     */
    clear(): void;
    /**
     * Dispose and clean up
     */
    dispose(): void;
}
//# sourceMappingURL=InsignIoManager.d.ts.map