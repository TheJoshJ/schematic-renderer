// managers/InsignIoManager.ts
import { EventEmitter } from "events";
import { InsignIoHighlight } from "./highlight/InsignIoHighlight";
/**
 * Manager for Insign IO regions - provides high-level API for visualizing
 * TypedCircuitExecutor IO layouts parsed from Insign annotations
 */
export class InsignIoManager extends EventEmitter {
    constructor(renderer) {
        super();
        Object.defineProperty(this, "renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ioRegions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "activeHighlights", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.renderer = renderer;
    }
    /**
     * Parse IO regions from Insign data
     * Looks for regions starting with 'io.' and extracts IO metadata
     */
    async parseFromInsign(dslMap) {
        this.clear();
        for (const [regionId, entry] of Object.entries(dslMap)) {
            // Only process regions starting with 'io.'
            if (!regionId.startsWith("io.")) {
                continue;
            }
            // Extract metadata
            const ioType = entry.metadata?.["type"];
            const dataType = entry.metadata?.["data_type"];
            const sortStrategy = entry.metadata?.["sort"];
            if (!ioType || !dataType) {
                console.warn(`[InsignIoManager] Region ${regionId} missing required metadata (type or data_type)`);
                continue;
            }
            // Map 'input'/'output' to 'input'/'output' direction
            let ioDirection;
            if (ioType === "input") {
                ioDirection = "input";
            }
            else if (ioType === "output") {
                ioDirection = "output";
            }
            else {
                console.warn(`[InsignIoManager] Unknown IO type '${ioType}' for region ${regionId}`);
                continue;
            }
            // Extract positions from bounding boxes
            // In a real implementation, we would call the Nucleation WASM function to extract
            // and sort positions. For now, we'll extract all block positions from bounding boxes.
            const positions = this.extractPositionsFromBoundingBoxes(entry);
            if (positions.length === 0) {
                console.warn(`[InsignIoManager] No positions found for region ${regionId}`);
                continue;
            }
            const ioRegion = {
                regionId,
                entry,
                positions,
                dataType,
                ioDirection,
                sortStrategy,
            };
            this.ioRegions.set(regionId, ioRegion);
        }
        console.log(`[InsignIoManager] Parsed ${this.ioRegions.size} IO regions`);
        this.emit("regionsLoaded", this.ioRegions);
    }
    /**
     * Extract block positions from bounding boxes
     * TODO: This should call Nucleation's extract_redstone_positions with proper sorting
     */
    extractPositionsFromBoundingBoxes(entry) {
        const positions = [];
        if (!entry.bounding_boxes) {
            return positions;
        }
        for (const box of entry.bounding_boxes) {
            const [min, max] = box;
            // Extract all positions in the bounding box
            for (let x = min[0]; x <= max[0]; x++) {
                for (let y = min[1]; y <= max[1]; y++) {
                    for (let z = min[2]; z <= max[2]; z++) {
                        positions.push([x, y, z]);
                    }
                }
            }
        }
        // TODO: Sort positions using the sort strategy from metadata
        // For now, just sort by Y, X, Z
        positions.sort((a, b) => {
            if (a[1] !== b[1])
                return a[1] - b[1]; // Y first
            if (a[0] !== b[0])
                return a[0] - b[0]; // Then X
            return a[2] - b[2]; // Then Z
        });
        return positions;
    }
    /**
     * Load and parse IO regions from the current schematic
     */
    async loadFromSchematic(schematicName) {
        const insignManager = this.renderer.insignManager;
        if (!insignManager) {
            console.warn("[InsignIoManager] InsignManager not available");
            return;
        }
        // Load Insign data
        const dslMap = await insignManager.loadFromSchematic(schematicName);
        if (!dslMap) {
            console.warn("[InsignIoManager] No Insign data available");
            return;
        }
        // Parse IO regions
        await this.parseFromInsign(dslMap);
    }
    /**
     * Get all IO region IDs
     */
    getAllRegionIds() {
        return Array.from(this.ioRegions.keys());
    }
    /**
     * Get filtered IO regions
     */
    getFilteredRegions(filter) {
        let regions = Array.from(this.ioRegions.values());
        if (filter.direction) {
            regions = regions.filter((r) => r.ioDirection === filter.direction);
        }
        if (filter.dataTypePattern) {
            const pattern = new RegExp(filter.dataTypePattern);
            regions = regions.filter((r) => pattern.test(r.dataType));
        }
        if (filter.minBits !== undefined) {
            regions = regions.filter((r) => r.positions.length >= filter.minBits);
        }
        if (filter.maxBits !== undefined) {
            regions = regions.filter((r) => r.positions.length <= filter.maxBits);
        }
        return regions;
    }
    /**
     * Show an IO region with optional custom style
     */
    showRegion(regionId, style) {
        const region = this.ioRegions.get(regionId);
        if (!region) {
            console.warn(`[InsignIoManager] IO region '${regionId}' not found`);
            return;
        }
        // If already active, just update style
        if (this.activeHighlights.has(regionId)) {
            if (style) {
                this.activeHighlights.get(regionId).updateStyle(style);
            }
            return;
        }
        // Create and activate highlight
        const highlight = new InsignIoHighlight(this.renderer, {
            regionId: region.regionId,
            entry: region.entry,
            positions: region.positions,
            dataType: region.dataType,
            ioDirection: region.ioDirection,
            style,
        });
        highlight.activate();
        this.activeHighlights.set(regionId, highlight);
        this.emit("regionShown", regionId);
    }
    /**
     * Show multiple IO regions
     */
    showRegions(regionIds, style) {
        regionIds.forEach((id) => this.showRegion(id, style));
    }
    /**
     * Show filtered IO regions
     */
    showFilteredRegions(filter, style) {
        const regions = this.getFilteredRegions(filter);
        regions.forEach((r) => this.showRegion(r.regionId, style));
    }
    /**
     * Show all IO regions
     */
    showAllRegions(style) {
        this.ioRegions.forEach((_, regionId) => this.showRegion(regionId, style));
    }
    /**
     * Show all inputs
     */
    showAllInputs(style) {
        this.showFilteredRegions({ direction: "input" }, style);
    }
    /**
     * Show all outputs
     */
    showAllOutputs(style) {
        this.showFilteredRegions({ direction: "output" }, style);
    }
    /**
     * Hide an IO region
     */
    hideRegion(regionId) {
        const highlight = this.activeHighlights.get(regionId);
        if (!highlight)
            return;
        highlight.deactivate();
        this.activeHighlights.delete(regionId);
        this.emit("regionHidden", regionId);
    }
    /**
     * Hide multiple IO regions
     */
    hideRegions(regionIds) {
        regionIds.forEach((id) => this.hideRegion(id));
    }
    /**
     * Hide filtered IO regions
     */
    hideFilteredRegions(filter) {
        const regions = this.getFilteredRegions(filter);
        regions.forEach((r) => this.hideRegion(r.regionId));
    }
    /**
     * Hide all IO regions
     */
    hideAllRegions() {
        Array.from(this.activeHighlights.keys()).forEach((id) => this.hideRegion(id));
    }
    /**
     * Toggle an IO region's visibility
     */
    toggleRegion(regionId, style) {
        if (this.activeHighlights.has(regionId)) {
            this.hideRegion(regionId);
        }
        else {
            this.showRegion(regionId, style);
        }
    }
    /**
     * Update the style of an active region
     */
    updateRegionStyle(regionId, style) {
        const highlight = this.activeHighlights.get(regionId);
        if (!highlight) {
            console.warn(`[InsignIoManager] IO region '${regionId}' is not currently shown`);
            return;
        }
        highlight.updateStyle(style);
    }
    /**
     * Check if a region is currently visible
     */
    isRegionVisible(regionId) {
        return this.activeHighlights.has(regionId);
    }
    /**
     * Get all currently visible region IDs
     */
    getVisibleRegionIds() {
        return Array.from(this.activeHighlights.keys());
    }
    /**
     * Get an IO region's data
     */
    getRegion(regionId) {
        return this.ioRegions.get(regionId) || null;
    }
    /**
     * Get all input regions
     */
    getAllInputs() {
        return this.getFilteredRegions({ direction: "input" });
    }
    /**
     * Get all output regions
     */
    getAllOutputs() {
        return this.getFilteredRegions({ direction: "output" });
    }
    /**
     * Get statistics about IO regions
     */
    getStatistics() {
        const regions = Array.from(this.ioRegions.values());
        const inputs = regions.filter((r) => r.ioDirection === "input");
        const outputs = regions.filter((r) => r.ioDirection === "output");
        const dataTypes = {};
        regions.forEach((r) => {
            dataTypes[r.dataType] = (dataTypes[r.dataType] || 0) + 1;
        });
        return {
            totalRegions: regions.length,
            inputs: inputs.length,
            outputs: outputs.length,
            totalInputBits: inputs.reduce((sum, r) => sum + r.positions.length, 0),
            totalOutputBits: outputs.reduce((sum, r) => sum + r.positions.length, 0),
            dataTypes,
        };
    }
    /**
     * Clear all data and hide all regions
     */
    clear() {
        this.hideAllRegions();
        this.ioRegions.clear();
        this.emit("cleared");
    }
    /**
     * Dispose and clean up
     */
    dispose() {
        this.clear();
        this.removeAllListeners();
    }
}
