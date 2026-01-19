import { CameraPath } from "../camera/CameraPath";
import { SchematicRenderer } from "../SchematicRenderer";
export interface CameraPathManagerOptions {
    showVisualization?: boolean;
}
export declare class CameraPathManager {
    private paths;
    private displayedPaths;
    private schematicRenderer;
    private showVisualization;
    constructor(schematicRenderer: SchematicRenderer, options?: CameraPathManagerOptions);
    addPath(name: string, path: CameraPath): void;
    getPath(name: string): CameraPath | undefined;
    removePath(name: string): void;
    /**
     * Enhanced fitCircularPathToSchematics with optimal framing
     */
    fitCircularPathToSchematics(name: string, options?: {
        padding?: number;
        minRadius?: number;
        maxRadius?: number;
        heightFactor?: number;
        samples?: number;
    }): void;
    private calculateSchematicBounds;
    /**
     * Calculate optimal circular path parameters using multiple sample points
     */
    private calculateOptimalCircularPath;
    /**
     * Calculate minimum radius needed to frame all schematics from a given height
     */
    private calculateMinimumRadius;
    /**
     * Calculate required radius for a specific viewing angle
     */
    private calculateRadiusForAngle;
    /**
     * Calculate optimal height for a given radius
     */
    private calculateOptimalHeight;
    /**
     * Create a camera path that provides cinematic views of the schematics
     */
    createCinematicPath(name: string, options?: {
        duration?: number;
        keyFrames?: number;
        heightVariation?: boolean;
        spiralEffect?: boolean;
    }): void;
    updatePathParameters(name: string, params: any): void;
    showPathVisualization(name: string): void;
    hidePathVisualization(name: string): void;
    hideAllPathVisualizations(): void;
    getPaths(): Map<string, CameraPath>;
    isPathVisible(name: string): boolean;
    dispose(): void;
    getAllPathNames(): string[];
    getDefaultPath(): CameraPath | undefined;
    getFirstPath(): {
        path: CameraPath;
        name: string;
    } | null;
}
//# sourceMappingURL=CameraPathManager.d.ts.map