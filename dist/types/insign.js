/**
 * TypeScript type definitions for Insign integration
 * Based on Nucleation v0.1.92 Insign support
 */
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Check if a region is an IO region
 */
export function isIoRegion(entry) {
    const ioType = entry.metadata["io.type"];
    return ioType === "i" || ioType === "o";
}
/**
 * Check if a region is an input
 */
export function isInputRegion(entry) {
    return entry.metadata["io.type"] === "i";
}
/**
 * Check if a region is an output
 */
export function isOutputRegion(entry) {
    return entry.metadata["io.type"] === "o";
}
/**
 * Get all positions within a bounding box
 */
export function* iterateBoxPositions(box) {
    const [[x1, y1, z1], [x2, y2, z2]] = box;
    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
            for (let z = z1; z <= z2; z++) {
                yield [x, y, z];
            }
        }
    }
}
/**
 * Get the center point of a bounding box
 */
export function getBoxCenter(box) {
    const [[x1, y1, z1], [x2, y2, z2]] = box;
    return [(x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2];
}
/**
 * Get the dimensions of a bounding box
 */
export function getBoxDimensions(box) {
    const [[x1, y1, z1], [x2, y2, z2]] = box;
    return [Math.abs(x2 - x1) + 1, Math.abs(y2 - y1) + 1, Math.abs(z2 - z1) + 1];
}
/**
 * Check if a region is anonymous
 */
export function isAnonymousRegion(regionId) {
    return regionId.startsWith("__anon:");
}
/**
 * Check if a region is a wildcard
 */
export function isWildcardRegion(regionId) {
    return regionId.endsWith(".*");
}
/**
 * Check if a region is global
 */
export function isGlobalRegion(regionId) {
    return regionId === "$global";
}
/**
 * Check if a region is a named region (not special)
 */
export function isNamedRegion(regionId) {
    return !isAnonymousRegion(regionId) && !isWildcardRegion(regionId) && !isGlobalRegion(regionId);
}
