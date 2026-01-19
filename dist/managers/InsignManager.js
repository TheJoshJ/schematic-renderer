// managers/InsignManager.ts
import { EventEmitter } from "events";
import { InsignRegionHighlight } from "./highlight/InsignRegionHighlight";
/**
 * Generate a color from a string hash (deterministic)
 */
function hashStringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate HSL color with good saturation and lightness
    const hue = Math.abs(hash % 360);
    const saturation = 60 + (Math.abs(hash >> 8) % 30); // 60-90%
    const lightness = 50 + (Math.abs(hash >> 16) % 20); // 50-70%
    // Convert HSL to RGB
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;
    const hue2rgb = (p, q, t) => {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    }
    else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return (Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255);
}
/**
 * Manager for Insign regions - provides a high-level API for loading, displaying, and managing
 * Insign region visualizations using the HighlightManager system.
 */
export class InsignManager extends EventEmitter {
    constructor(renderer) {
        super();
        Object.defineProperty(this, "renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "insignData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
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
     * Generate a deterministic color from a string (e.g., region ID)
     * Useful for consistent coloring across sessions
     */
    static generateColorFromString(str) {
        return hashStringToColor(str);
    }
    /**
     * Load Insign data from a schematic
     * @param schematicName - Name of the schematic (optional, uses first schematic if not provided)
     * @returns The compiled Insign data
     */
    async loadFromSchematic(schematicName) {
        if (!this.renderer.schematicManager) {
            console.warn("[InsignManager] SchematicManager not initialized");
            this.insignData = null;
            this.emit("dataLoaded", null);
            return null;
        }
        const schematic = schematicName
            ? this.renderer.schematicManager.getSchematic(schematicName)
            : this.renderer.schematicManager.getAllSchematics()[0];
        if (!schematic) {
            console.warn("[InsignManager] No schematic available");
            this.insignData = null;
            this.emit("dataLoaded", null);
            return null;
        }
        try {
            const compiledData = schematic.compileInsign();
            // Handle both Map (from WASM) and plain objects
            const hasData = compiledData &&
                (compiledData instanceof Map
                    ? compiledData.size > 0
                    : Object.keys(compiledData).length > 0);
            if (hasData) {
                // Convert Map to plain object for easier use
                if (compiledData instanceof Map) {
                    const obj = {};
                    compiledData.forEach((value, key) => {
                        // Each value is also a Map, convert it too
                        if (value instanceof Map) {
                            const entry = {};
                            value.forEach((v, k) => {
                                // Recursively convert nested Maps (like metadata)
                                if (v instanceof Map) {
                                    const nested = {};
                                    v.forEach((nv, nk) => {
                                        nested[nk] = nv;
                                    });
                                    entry[k] = nested;
                                }
                                else {
                                    entry[k] = v;
                                }
                            });
                            obj[key] = entry;
                        }
                        else {
                            obj[key] = value;
                        }
                    });
                    this.insignData = obj;
                }
                else {
                    this.insignData = compiledData;
                }
                console.log(`[InsignManager] Loaded Insign data with ${Object.keys(this.insignData).length} regions`);
                this.emit("dataLoaded", this.insignData);
                return this.insignData;
            }
            else {
                console.warn("[InsignManager] No Insign data found in schematic");
                this.insignData = null;
                this.emit("dataLoaded", null);
                return null;
            }
        }
        catch (error) {
            console.error("[InsignManager] Failed to compile Insign data:", error);
            this.insignData = null;
            this.emit("dataLoaded", null);
            return null;
        }
    }
    /**
     * Get the currently loaded Insign data
     */
    getData() {
        return this.insignData;
    }
    /**
     * Get all region IDs
     */
    getAllRegionIds() {
        return this.insignData ? Object.keys(this.insignData) : [];
    }
    /**
     * Get regions filtered by criteria
     */
    getFilteredRegions(filter) {
        if (!this.insignData)
            return [];
        let regions = Object.entries(this.insignData).map(([id, entry]) => ({ id, entry }));
        // Filter by metadata
        if (filter.metadata) {
            regions = regions.filter(({ entry }) => {
                return Object.entries(filter.metadata).every(([key, value]) => {
                    return entry.metadata && entry.metadata[key] === value;
                });
            });
        }
        // Filter by ID pattern
        if (filter.idPattern) {
            const pattern = filter.idPattern.replace(/\*/g, ".*");
            const regex = new RegExp(`^${pattern}$`);
            regions = regions.filter(({ id }) => regex.test(id));
        }
        return regions;
    }
    /**
     * Get color for a region from metadata or hash
     * Checks for 'vis.color' metadata, then 'doc.color', then generates from ID hash
     */
    getRegionColor(regionId, entry) {
        // Check for explicit color in metadata
        const visColor = entry.metadata?.["vis.color"];
        if (visColor) {
            // Parse color string (hex or named)
            if (typeof visColor === "string") {
                if (visColor.startsWith("#")) {
                    return parseInt(visColor.slice(1), 16);
                }
                else if (visColor.startsWith("0x")) {
                    return parseInt(visColor.slice(2), 16);
                }
            }
            else if (typeof visColor === "number") {
                return visColor;
            }
        }
        // Fallback to hash-based color
        return hashStringToColor(regionId);
    }
    /**
     * Show a region with optional custom style
     * @param regionId - The region ID to show
     * @param style - Optional style override
     */
    showRegion(regionId, style) {
        if (!this.insignData || !this.insignData[regionId]) {
            console.warn(`[InsignManager] Region '${regionId}' not found in Insign data`);
            return;
        }
        // Skip IO regions (those starting with 'io.') - they should be handled by InsignIoManager
        if (regionId.startsWith("io.")) {
            console.log(`[InsignManager] Skipping IO region '${regionId}' - use InsignIoManager instead`);
            return;
        }
        // If already active, just update style
        if (this.activeHighlights.has(regionId)) {
            if (style) {
                this.activeHighlights.get(regionId).updateStyle(style);
            }
            return;
        }
        // Determine default style based on metadata
        const entry = this.insignData[regionId];
        // Use hash-based coloring for all non-IO regions
        const defaultStyle = {
            ...InsignManager.STYLE_PRESETS.default,
            color: this.getRegionColor(regionId, entry),
        };
        // Allow explicit color override via vis.color metadata
        if (!style?.color && entry.metadata?.["vis.color"]) {
            defaultStyle.color = this.getRegionColor(regionId, entry);
        }
        // Create and activate highlight
        const highlight = new InsignRegionHighlight(this.renderer, {
            regionId,
            entry,
            style: { ...defaultStyle, ...style },
        });
        highlight.activate();
        this.activeHighlights.set(regionId, highlight);
        this.emit("regionShown", regionId);
    }
    /**
     * Show multiple regions at once
     */
    showRegions(regionIds, style) {
        regionIds.forEach((id) => this.showRegion(id, style));
    }
    /**
     * Show regions matching a filter
     */
    showFilteredRegions(filter, style) {
        const regions = this.getFilteredRegions(filter);
        regions.forEach(({ id }) => this.showRegion(id, style));
    }
    /**
     * Show all regions
     */
    showAllRegions(style) {
        if (!this.insignData)
            return;
        Object.keys(this.insignData).forEach((id) => this.showRegion(id, style));
    }
    /**
     * Hide a region
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
     * Hide multiple regions
     */
    hideRegions(regionIds) {
        regionIds.forEach((id) => this.hideRegion(id));
    }
    /**
     * Hide regions matching a filter
     */
    hideFilteredRegions(filter) {
        const regions = this.getFilteredRegions(filter);
        regions.forEach(({ id }) => this.hideRegion(id));
    }
    /**
     * Hide all regions
     */
    hideAllRegions() {
        Array.from(this.activeHighlights.keys()).forEach((id) => this.hideRegion(id));
    }
    /**
     * Toggle a region's visibility
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
            console.warn(`[InsignManager] Region '${regionId}' is not currently shown`);
            return;
        }
        highlight.updateStyle(style);
    }
    /**
     * Update the style of multiple regions
     */
    updateRegionsStyle(regionIds, style) {
        regionIds.forEach((id) => this.updateRegionStyle(id, style));
    }
    /**
     * Update the style of all active regions matching a filter
     */
    updateFilteredRegionsStyle(filter, style) {
        const regions = this.getFilteredRegions(filter);
        const activeRegions = regions.filter(({ id }) => this.activeHighlights.has(id));
        activeRegions.forEach(({ id }) => this.updateRegionStyle(id, style));
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
     * Clear all data and hide all regions
     */
    clear() {
        this.hideAllRegions();
        this.insignData = null;
        this.emit("cleared");
    }
    /**
     * Get a region's entry (metadata and bounding boxes)
     */
    getRegionEntry(regionId) {
        return this.insignData?.[regionId] || null;
    }
    /**
     * Query regions by metadata
     */
    queryByMetadata(key, value) {
        if (!this.insignData)
            return [];
        return Object.entries(this.insignData)
            .filter(([_, entry]) => {
            if (!entry.metadata)
                return false;
            if (value === undefined) {
                return key in entry.metadata;
            }
            return entry.metadata[key] === value;
        })
            .map(([id, entry]) => ({ id, entry }));
    }
    /**
     * Get regions by IO type (input/output)
     * @deprecated Use InsignIoManager for IO regions instead
     */
    getByIOType(type) {
        console.warn("[InsignManager] getByIOType is deprecated - use InsignIoManager for IO regions");
        return this.queryByMetadata("io.type", type);
    }
    /**
     * Helper: Show all inputs
     * @deprecated Use InsignIoManager.showAllInputs() for IO regions instead
     */
    showAllInputs(style) {
        console.warn("[InsignManager] showAllInputs is deprecated - use InsignIoManager for IO regions");
        const inputs = this.getByIOType("i");
        inputs.forEach(({ id }) => this.showRegion(id, style));
    }
    /**
     * Helper: Show all outputs
     * @deprecated Use InsignIoManager.showAllOutputs() for IO regions instead
     */
    showAllOutputs(style) {
        console.warn("[InsignManager] showAllOutputs is deprecated - use InsignIoManager for IO regions");
        const outputs = this.getByIOType("o");
        outputs.forEach(({ id }) => this.showRegion(id, style));
    }
    /**
     * Helper: Show only IO regions (inputs and outputs)
     * @deprecated Use InsignIoManager for IO regions instead
     */
    showOnlyIO(style) {
        console.warn("[InsignManager] showOnlyIO is deprecated - use InsignIoManager for IO regions");
        this.hideAllRegions();
        this.showAllInputs(style);
        this.showAllOutputs(style);
    }
}
// Style presets
Object.defineProperty(InsignManager, "STYLE_PRESETS", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        input: {
            color: 0x4499ff,
            opacity: 0.15,
            filled: true,
            showLabel: true,
            showEdges: true,
            edgeThickness: 0.04,
        },
        output: {
            color: 0xff4466,
            opacity: 0.15,
            filled: true,
            showLabel: true,
            showEdges: true,
            edgeThickness: 0.04,
        },
        default: {
            color: 0x44ff66,
            opacity: 0.15,
            filled: true,
            showLabel: true,
            showEdges: true,
            edgeThickness: 0.04,
        },
        selected: {
            color: 0xffcc00,
            opacity: 0.25,
            filled: true,
            showLabel: true,
            showEdges: true,
            edgeThickness: 0.05,
        },
        hidden: { visible: false, showLabel: false },
        filled: { filled: true, opacity: 0.2, showLabel: true, showEdges: true, edgeThickness: 0.04 },
        edgesOnly: {
            filled: false,
            opacity: 1.0,
            showLabel: true,
            showEdges: true,
            edgeThickness: 0.06,
        },
    }
});
