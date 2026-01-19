import * as THREE from "three";
import { ExportOptions, ExportFormat, ExportQuality, ExportResult, QualityPreset, ExportEventType, ExportEventHandler } from "../types/export";
/**
 * SchematicExporter - Handles exporting schematics to various 3D formats
 *
 * Features:
 * - Multiple format support (GLTF, GLB, OBJ, STL)
 * - Normal fixing for proper rendering in external viewers
 * - Quality presets
 * - Progress callbacks
 * - Event system
 */
export declare class SchematicExporter {
    private eventListeners;
    private currentExport;
    constructor();
    /**
     * Export a THREE.Object3D to the specified format
     */
    export(object: THREE.Object3D, options?: ExportOptions): Promise<ExportResult>;
    /**
     * Cancel the current export
     */
    cancel(): void;
    /**
     * Subscribe to export events
     */
    on<T extends ExportEventType>(event: T, handler: ExportEventHandler<T>): () => void;
    /**
     * Unsubscribe from export events
     */
    off<T extends ExportEventType>(event: T, handler: ExportEventHandler<T>): void;
    /**
     * Emit an event
     */
    private emit;
    /**
     * Emit progress event
     */
    private emitProgress;
    /**
     * Resolve options with defaults and quality presets
     */
    private resolveOptions;
    /**
     * Get filename with proper extension
     */
    private getFilename;
    /**
     * Prepare export group by cloning and processing the object
     */
    private prepareExportGroup;
    /**
     * Filter to only visible meshes
     */
    private filterVisibleMeshes;
    /**
     * Center the object at origin
     */
    private centerAtOrigin;
    /**
     * Process normals based on the selected mode
     * This fixes the "inside out" issue in external viewers
     */
    private processNormals;
    /**	 * Deep clone an object, including geometry buffer data
     * This is necessary because Three.js clone() shares buffer data
     */
    private deepCloneObject;
    /**
     * Flip face winding order by reversing triangle indices
     */
    private flipFaceWinding;
    /**
     * Helper to swap array values
     */
    private swapArrayValues;
    /**
     * Set materials to double-sided and fix depth settings
     */
    private setDoubleSided;
    /**
     * Fix all materials for proper export
     * Ensures depth write/test are properly set to avoid transparency sorting issues
     * Forces nearest neighbor filtering for pixel art textures
     */
    private fixMaterialsForExport;
    /**
     * Set nearest neighbor filtering on all textures in a material
     * This preserves the crisp pixel art look of Minecraft textures
     */
    private setNearestFilterOnMaterial;
    /**
     * Optimize geometry for export
     */
    private optimizeGeometry;
    /**
     * Export to GLTF/GLB format
     */
    private exportGLTF;
    /**
     * Export to OBJ format (basic implementation)
     */
    private exportOBJ;
    /**
     * Export to STL format (basic implementation)
     */
    private exportSTL;
    /**
     * Clean up cloned export group
     */
    private disposeExportGroup;
    /**
     * Create an export error
     */
    private createError;
    /**
     * Download the export result
     */
    download(result: ExportResult): void;
    /**
     * Revoke download URL to free memory
     */
    revokeUrl(result: ExportResult): void;
    /**
     * Get available export formats
     */
    static getAvailableFormats(): ExportFormat[];
    /**
     * Get format description
     */
    static getFormatDescription(format: ExportFormat): string;
    /**
     * Get format file extension
     */
    static getFormatExtension(format: ExportFormat): string;
    /**
     * Get quality preset configuration
     */
    static getQualityPreset(quality: ExportQuality): QualityPreset;
}
//# sourceMappingURL=SchematicExporter.d.ts.map