import { EventEmitter } from "events";
import { SchematicRenderer } from "../SchematicRenderer";
import { InsignRegionStyle } from "./highlight/InsignRegionHighlight";
import { DslMap, DslEntry } from "../types/insign";
export interface InsignRegionFilter {
    /** Filter by metadata key-value pairs (e.g., { 'io.type': 'i' }) */
    metadata?: Record<string, string>;
    /** Filter by region ID pattern (supports wildcards: 'cpu.*') */
    idPattern?: string;
}
/**
 * Manager for Insign regions - provides a high-level API for loading, displaying, and managing
 * Insign region visualizations using the HighlightManager system.
 */
export declare class InsignManager extends EventEmitter {
    private renderer;
    private insignData;
    private activeHighlights;
    static readonly STYLE_PRESETS: Record<string, Partial<InsignRegionStyle>>;
    constructor(renderer: SchematicRenderer);
    /**
     * Generate a deterministic color from a string (e.g., region ID)
     * Useful for consistent coloring across sessions
     */
    static generateColorFromString(str: string): number;
    /**
     * Load Insign data from a schematic
     * @param schematicName - Name of the schematic (optional, uses first schematic if not provided)
     * @returns The compiled Insign data
     */
    loadFromSchematic(schematicName?: string): Promise<DslMap | null>;
    /**
     * Get the currently loaded Insign data
     */
    getData(): DslMap | null;
    /**
     * Get all region IDs
     */
    getAllRegionIds(): string[];
    /**
     * Get regions filtered by criteria
     */
    getFilteredRegions(filter: InsignRegionFilter): Array<{
        id: string;
        entry: DslEntry;
    }>;
    /**
     * Get color for a region from metadata or hash
     * Checks for 'vis.color' metadata, then 'doc.color', then generates from ID hash
     */
    private getRegionColor;
    /**
     * Show a region with optional custom style
     * @param regionId - The region ID to show
     * @param style - Optional style override
     */
    showRegion(regionId: string, style?: Partial<InsignRegionStyle>): void;
    /**
     * Show multiple regions at once
     */
    showRegions(regionIds: string[], style?: Partial<InsignRegionStyle>): void;
    /**
     * Show regions matching a filter
     */
    showFilteredRegions(filter: InsignRegionFilter, style?: Partial<InsignRegionStyle>): void;
    /**
     * Show all regions
     */
    showAllRegions(style?: Partial<InsignRegionStyle>): void;
    /**
     * Hide a region
     */
    hideRegion(regionId: string): void;
    /**
     * Hide multiple regions
     */
    hideRegions(regionIds: string[]): void;
    /**
     * Hide regions matching a filter
     */
    hideFilteredRegions(filter: InsignRegionFilter): void;
    /**
     * Hide all regions
     */
    hideAllRegions(): void;
    /**
     * Toggle a region's visibility
     */
    toggleRegion(regionId: string, style?: Partial<InsignRegionStyle>): void;
    /**
     * Update the style of an active region
     */
    updateRegionStyle(regionId: string, style: Partial<InsignRegionStyle>): void;
    /**
     * Update the style of multiple regions
     */
    updateRegionsStyle(regionIds: string[], style: Partial<InsignRegionStyle>): void;
    /**
     * Update the style of all active regions matching a filter
     */
    updateFilteredRegionsStyle(filter: InsignRegionFilter, style: Partial<InsignRegionStyle>): void;
    /**
     * Check if a region is currently visible
     */
    isRegionVisible(regionId: string): boolean;
    /**
     * Get all currently visible region IDs
     */
    getVisibleRegionIds(): string[];
    /**
     * Clear all data and hide all regions
     */
    clear(): void;
    /**
     * Get a region's entry (metadata and bounding boxes)
     */
    getRegionEntry(regionId: string): DslEntry | null;
    /**
     * Query regions by metadata
     */
    queryByMetadata(key: string, value?: string): Array<{
        id: string;
        entry: DslEntry;
    }>;
    /**
     * Get regions by IO type (input/output)
     * @deprecated Use InsignIoManager for IO regions instead
     */
    getByIOType(type: "i" | "o"): Array<{
        id: string;
        entry: DslEntry;
    }>;
    /**
     * Helper: Show all inputs
     * @deprecated Use InsignIoManager.showAllInputs() for IO regions instead
     */
    showAllInputs(style?: Partial<InsignRegionStyle>): void;
    /**
     * Helper: Show all outputs
     * @deprecated Use InsignIoManager.showAllOutputs() for IO regions instead
     */
    showAllOutputs(style?: Partial<InsignRegionStyle>): void;
    /**
     * Helper: Show only IO regions (inputs and outputs)
     * @deprecated Use InsignIoManager for IO regions instead
     */
    showOnlyIO(style?: Partial<InsignRegionStyle>): void;
}
//# sourceMappingURL=InsignManager.d.ts.map