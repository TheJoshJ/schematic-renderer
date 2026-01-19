import { EventEmitter } from "events";
import { SchematicRenderer } from "../SchematicRenderer";
import { EditableRegionHighlight } from "./highlight/EditableRegionHighlight";
export declare class RegionManager extends EventEmitter {
    private renderer;
    private regions;
    private definitionRegionNames;
    constructor(renderer: SchematicRenderer);
    private setupEventListeners;
    private getRegionByObject;
    createRegion(name: string, min: {
        x: number;
        y: number;
        z: number;
    }, max: {
        x: number;
        y: number;
        z: number;
    }, schematicId?: string, options?: {
        color?: number;
        opacity?: number;
    }): EditableRegionHighlight;
    setEditMode(enabled: boolean): void;
    getRegion(name: string): EditableRegionHighlight | undefined;
    removeRegion(name: string): boolean;
    /**
     * Selects a region for editing with gizmos
     */
    editRegion(name: string): void;
    /**
     * Updates the visual appearance of a region
     */
    updateRegionLook(name: string, options: {
        color?: number;
        opacity?: number;
    }): void;
    getAllRegions(): EditableRegionHighlight[];
    getRegionsForSchematic(schematicId: string): EditableRegionHighlight[];
    /**
     * Load definition regions from a schematic's metadata.
     * These are regions stored in NucleationDefinitions (e.g., from CircuitBuilder or Insign).
     *
     * @param schematicId - The ID of the schematic to load regions from
     * @param autoActivate - Whether to immediately show the regions (default: true based on options)
     * @returns Array of created region names
     */
    loadDefinitionRegionsFromSchematic(schematicId: string, autoActivate?: boolean): string[];
    /**
     * Show all definition regions for a schematic
     */
    showDefinitionRegions(schematicId: string): void;
    /**
     * Hide all definition regions for a schematic
     */
    hideDefinitionRegions(schematicId: string): void;
    /**
     * Toggle visibility of all definition regions for a schematic
     */
    toggleDefinitionRegions(schematicId: string): boolean;
    /**
     * Remove all definition regions for a schematic
     */
    removeDefinitionRegions(schematicId: string): void;
    /**
     * Get all definition region names for a schematic
     */
    getDefinitionRegionNames(schematicId: string): string[];
    /**
     * Check if a schematic has definition regions loaded
     */
    hasDefinitionRegions(schematicId: string): boolean;
    dispose(): void;
}
//# sourceMappingURL=RegionManager.d.ts.map