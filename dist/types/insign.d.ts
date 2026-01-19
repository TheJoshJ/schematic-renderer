/**
 * TypeScript type definitions for Insign integration
 * Based on Nucleation v0.1.92 Insign support
 */
/**
 * A 3D bounding box defined by two corners (min and max)
 * Both corners are inclusive
 * Format: [[x1, y1, z1], [x2, y2, z2]]
 *
 * Note: All coordinates are ABSOLUTE (relative coords are resolved during compilation)
 */
export type BoxPair = [[number, number, number], [number, number, number]];
/**
 * Entry in the Insign compilation output
 * Contains bounding boxes and metadata for a single region
 */
export interface DslEntry {
    /**
     * Optional array of bounding boxes defining this region's geometry
     * Undefined for special entries like $global
     * All coordinates are ABSOLUTE (relative coords resolved during compilation)
     *
     * Each box is [[x1,y1,z1], [x2,y2,z2]] where:
     * - Both corners are inclusive
     * - Boxes are normalized (min <= max per axis)
     */
    bounding_boxes?: BoxPair[];
    /**
     * Metadata key-value pairs attached to this region
     * Keys are namespaced (e.g., "io.type", "doc.label", "logic.clock_hz")
     * Values can be any JSON-serializable type
     */
    metadata: Record<string, any>;
}
/**
 * Complete Insign compilation output
 * Maps region IDs to their entries
 * Keys are ordered deterministically (BTreeMap from Rust)
 *
 * Special key formats:
 * - "$global": Global metadata applying to all regions
 * - "prefix.*": Wildcard metadata (e.g., "cpu.*" applies to "cpu.core", "cpu.alu", etc.)
 * - "__anon:{tuple}:{stmt}": Anonymous regions (e.g., "__anon:0:0")
 * - Regular IDs: Named regions (e.g., "cpu.core", "dataloop.alu", "input_a")
 */
export type DslMap = Record<string, DslEntry>;
/**
 * Sign input data extracted from schematic
 * Used as intermediate format before Insign compilation
 */
export interface SignInput {
    /** Absolute position of the sign in the schematic [x, y, z] */
    pos: [number, number, number];
    /** Raw text content from the sign (may contain multiple lines) */
    text: string;
}
/**
 * Check if a region is an IO region
 */
export declare function isIoRegion(entry: DslEntry): boolean;
/**
 * Check if a region is an input
 */
export declare function isInputRegion(entry: DslEntry): boolean;
/**
 * Check if a region is an output
 */
export declare function isOutputRegion(entry: DslEntry): boolean;
/**
 * Get all positions within a bounding box
 */
export declare function iterateBoxPositions(box: BoxPair): Generator<[number, number, number]>;
/**
 * Get the center point of a bounding box
 */
export declare function getBoxCenter(box: BoxPair): [number, number, number];
/**
 * Get the dimensions of a bounding box
 */
export declare function getBoxDimensions(box: BoxPair): [number, number, number];
/**
 * Check if a region is anonymous
 */
export declare function isAnonymousRegion(regionId: string): boolean;
/**
 * Check if a region is a wildcard
 */
export declare function isWildcardRegion(regionId: string): boolean;
/**
 * Check if a region is global
 */
export declare function isGlobalRegion(regionId: string): boolean;
/**
 * Check if a region is a named region (not special)
 */
export declare function isNamedRegion(regionId: string): boolean;
//# sourceMappingURL=insign.d.ts.map