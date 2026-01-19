import { EventEmitter } from "events";
import * as THREE from "three";
import { EditableRegionHighlight } from "./highlight/EditableRegionHighlight";
export class RegionManager extends EventEmitter {
    constructor(renderer) {
        super();
        Object.defineProperty(this, "renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "regions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        // Track which regions came from definition metadata (vs manually created)
        Object.defineProperty(this, "definitionRegionNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        }); // schematicId -> Set of region names
        this.renderer = renderer;
        this.setupEventListeners();
    }
    setupEventListeners() {
        // Listen for gizmo modifications to snap regions to grid
        this.renderer.eventEmitter.on("gizmoObjectModified", (data) => {
            const region = this.getRegionByObject(data.object);
            if (region) {
                // Check if modification came from a handle or the main group
                // For now we assume main group since we haven't implemented handle selection fully
                region.updateBoundsFromTransform();
                this.emit("regionModified", region);
            }
        });
    }
    getRegionByObject(object) {
        for (const region of this.regions.values()) {
            // Check if object is the region group itself
            if (region.group === object) {
                return region;
            }
            // Check if object is a child of the region group (e.g. handle)
            // Traverse up to find if it belongs to this region
            let parent = object.parent;
            while (parent) {
                if (parent === region.group) {
                    return region;
                }
                parent = parent.parent;
            }
        }
        return undefined;
    }
    createRegion(name, min, max, schematicId, options) {
        if (this.regions.has(name)) {
            console.warn(`Region ${name} already exists, updating bounds.`);
            const region = this.regions.get(name);
            region.setBounds(new THREE.Vector3(min.x, min.y, min.z), new THREE.Vector3(max.x, max.y, max.z));
            if (options) {
                if (options.color !== undefined)
                    region.setColor(options.color);
                if (options.opacity !== undefined)
                    region.setOpacity(options.opacity);
            }
            return region;
        }
        const region = new EditableRegionHighlight(this.renderer, {
            name,
            min,
            max,
            schematicId,
            ...options,
        });
        this.regions.set(name, region);
        // region.activate(); // Don't auto-activate, wait for edit mode or explicit show
        return region;
    }
    setEditMode(enabled) {
        this.regions.forEach((region) => {
            region.setEditMode(enabled);
            if (enabled) {
                region.activate();
            }
            else {
                region.deactivate();
            }
        });
        if (!enabled) {
            this.renderer.gizmoManager?.detach();
        }
    }
    getRegion(name) {
        return this.regions.get(name);
    }
    removeRegion(name) {
        const region = this.regions.get(name);
        if (region) {
            region.dispose();
            this.regions.delete(name);
            return true;
        }
        return false;
    }
    /**
     * Selects a region for editing with gizmos
     */
    editRegion(name) {
        const region = this.regions.get(name);
        if (region && this.renderer.gizmoManager) {
            // Ensure region handles are visible
            region.setEditMode(true);
            region.activate();
            // We need to trigger the selection event that GizmoManager listens to
            this.renderer.eventEmitter.emit("objectSelected", region);
            // Default to translate mode for moving the whole region, since handles allow scaling
            this.renderer.gizmoManager.setMode("translate");
            // Force gizmo visibility and ensure it's on top
            // Access private property safely
            const gizmoManager = this.renderer.gizmoManager;
            if (gizmoManager.transformControls) {
                const controls = gizmoManager.transformControls;
                controls.visible = true;
                controls.enabled = true;
                // Force depth test disable again to be sure
                controls.depthTest = false;
                controls.depthWrite = false;
                controls.renderOrder = 999;
                // Make sure we update the helper immediately
                if (gizmoManager.update)
                    gizmoManager.update();
            }
        }
        else {
            console.warn(`Region ${name} not found or GizmoManager not enabled.`);
        }
    }
    /**
     * Updates the visual appearance of a region
     */
    updateRegionLook(name, options) {
        const region = this.regions.get(name);
        if (region) {
            if (options.color !== undefined) {
                region.setColor(options.color);
            }
            if (options.opacity !== undefined) {
                region.setOpacity(options.opacity);
            }
        }
        else {
            console.warn(`Region ${name} not found.`);
        }
    }
    getAllRegions() {
        return Array.from(this.regions.values());
    }
    getRegionsForSchematic(schematicId) {
        return Array.from(this.regions.values()).filter((region) => region.schematicId === schematicId);
    }
    /**
     * Load definition regions from a schematic's metadata.
     * These are regions stored in NucleationDefinitions (e.g., from CircuitBuilder or Insign).
     *
     * @param schematicId - The ID of the schematic to load regions from
     * @param autoActivate - Whether to immediately show the regions (default: true based on options)
     * @returns Array of created region names
     */
    loadDefinitionRegionsFromSchematic(schematicId, autoActivate) {
        const schematic = this.renderer.schematicManager?.getSchematic(schematicId);
        if (!schematic) {
            console.warn(`[RegionManager] Cannot load definition regions: Schematic '${schematicId}' not found.`);
            return [];
        }
        const schematicWrapper = schematic.schematicWrapper;
        const regionNames = schematicWrapper.getDefinitionRegionNames();
        if (regionNames.length === 0) {
            console.log(`[RegionManager] No definition regions found in schematic '${schematicId}'.`);
            return [];
        }
        console.log(`[RegionManager] Loading ${regionNames.length} definition regions from '${schematicId}':`, regionNames);
        const options = this.renderer.options.definitionRegionOptions || {};
        const shouldActivate = autoActivate ?? options.showOnLoad ?? true;
        const createdNames = [];
        // Track which regions belong to this schematic
        if (!this.definitionRegionNames.has(schematicId)) {
            this.definitionRegionNames.set(schematicId, new Set());
        }
        const schematicRegions = this.definitionRegionNames.get(schematicId);
        for (const regionName of regionNames) {
            try {
                const defRegion = schematicWrapper.getDefinitionRegion(regionName);
                const bounds = defRegion.getBounds();
                if (!bounds) {
                    console.warn(`[RegionManager] Region '${regionName}' is empty, skipping.`);
                    defRegion.free();
                    continue;
                }
                // Get region metadata for color/styling
                const metadata = defRegion.getAllMetadata();
                let color = options.defaultColor ?? 0x00ff88;
                const opacity = options.defaultOpacity ?? 0.25;
                // Check for color in metadata (format: "#RRGGBB")
                if (metadata && metadata.color) {
                    const colorStr = metadata.color;
                    if (colorStr.startsWith("#")) {
                        color = parseInt(colorStr.slice(1), 16);
                    }
                }
                // Scope the name to the schematic
                const scopedName = `${schematicId}_defRegion_${regionName}`;
                // Create the editable region highlight
                const region = this.createRegion(scopedName, { x: bounds.min[0], y: bounds.min[1], z: bounds.min[2] }, { x: bounds.max[0], y: bounds.max[1], z: bounds.max[2] }, schematicId, { color, opacity });
                // Set the actual complex region definition (handles disjoint boxes)
                region.setBaseRegion(defRegion);
                // If the definition region has multiple boxes, we need to set them
                const boxes = defRegion.getBoxes();
                if (boxes.length > 1) {
                    console.log(`[RegionManager] Region '${regionName}' has ${boxes.length} boxes.`);
                } // Store metadata for reference
                region.definitionMetadata = metadata;
                region.originalRegionName = regionName;
                schematicRegions.add(scopedName);
                createdNames.push(scopedName);
                if (shouldActivate) {
                    region.activate();
                }
                defRegion.free();
            }
            catch (e) {
                console.error(`[RegionManager] Error loading definition region '${regionName}':`, e);
            }
        }
        console.log(`[RegionManager] Loaded ${createdNames.length} definition regions for '${schematicId}'.`);
        this.emit("definitionRegionsLoaded", { schematicId, regionNames: createdNames });
        return createdNames;
    }
    /**
     * Show all definition regions for a schematic
     */
    showDefinitionRegions(schematicId) {
        const regionNames = this.definitionRegionNames.get(schematicId);
        if (!regionNames) {
            console.warn(`[RegionManager] No definition regions found for schematic '${schematicId}'.`);
            return;
        }
        for (const name of regionNames) {
            const region = this.regions.get(name);
            if (region) {
                region.activate();
            }
        }
    }
    /**
     * Hide all definition regions for a schematic
     */
    hideDefinitionRegions(schematicId) {
        const regionNames = this.definitionRegionNames.get(schematicId);
        if (!regionNames)
            return;
        for (const name of regionNames) {
            const region = this.regions.get(name);
            if (region) {
                region.deactivate();
            }
        }
    }
    /**
     * Toggle visibility of all definition regions for a schematic
     */
    toggleDefinitionRegions(schematicId) {
        const regionNames = this.definitionRegionNames.get(schematicId);
        if (!regionNames || regionNames.size === 0)
            return false;
        // Check if any are visible to determine toggle direction
        const firstRegionName = regionNames.values().next().value;
        if (!firstRegionName)
            return false;
        const firstRegion = this.regions.get(firstRegionName);
        const shouldShow = firstRegion ? !firstRegion.group.visible : true;
        if (shouldShow) {
            this.showDefinitionRegions(schematicId);
        }
        else {
            this.hideDefinitionRegions(schematicId);
        }
        return shouldShow;
    }
    /**
     * Remove all definition regions for a schematic
     */
    removeDefinitionRegions(schematicId) {
        const regionNames = this.definitionRegionNames.get(schematicId);
        if (!regionNames)
            return;
        for (const name of regionNames) {
            this.removeRegion(name);
        }
        this.definitionRegionNames.delete(schematicId);
    }
    /**
     * Get all definition region names for a schematic
     */
    getDefinitionRegionNames(schematicId) {
        const regionNames = this.definitionRegionNames.get(schematicId);
        return regionNames ? Array.from(regionNames) : [];
    }
    /**
     * Check if a schematic has definition regions loaded
     */
    hasDefinitionRegions(schematicId) {
        const regionNames = this.definitionRegionNames.get(schematicId);
        return regionNames ? regionNames.size > 0 : false;
    }
    dispose() {
        this.regions.forEach((region) => region.dispose());
        this.regions.clear();
        this.definitionRegionNames.clear();
    }
}
