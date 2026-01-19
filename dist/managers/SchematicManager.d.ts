import * as THREE from "three";
import { SchematicObject } from "./SchematicObject";
import { SchematicWrapper } from "nucleation";
import { EventEmitter } from "events";
import { SchematicRenderer } from "../SchematicRenderer";
interface LoadingProgress {
    stage: "file_reading" | "parsing" | "mesh_building" | "scene_setup";
    progress: number;
    message: string;
}
export interface SchematicManagerOptions {
    singleSchematicMode?: boolean;
    callbacks?: {
        onSchematicFileLoaded?: (file: File) => void | Promise<void>;
        onSchematicFileLoadFailure?: (file: File) => void | Promise<void>;
    };
}
export declare class SchematicManager {
    schematics: Map<string, SchematicObject>;
    schematicRenderer: SchematicRenderer;
    eventEmitter: EventEmitter;
    private worldMeshBuilder;
    private options;
    private sceneManager;
    private singleSchematicMode;
    constructor(schematicRenderer: SchematicRenderer, options?: SchematicManagerOptions);
    private readFileWithProgress;
    private isSchematicWrapper;
    loadSchematic(name: string, schematicData: ArrayBuffer | SchematicWrapper, properties?: Partial<{
        position: THREE.Vector3 | number[];
        rotation: THREE.Euler | number[];
        scale: THREE.Vector3 | number[] | number;
        opacity: number;
        visible: boolean;
        focused: boolean;
    }>, options?: {
        onProgress?: (progress: LoadingProgress) => void;
    }): Promise<void>;
    removeAllSchematics(): Promise<void>;
    /**
     * Performs comprehensive memory cleanup after schematic operations
     * This should be called between test runs to prevent memory leaks
     * NOTE: Does NOT dispose WorldMeshBuilder as it's shared and needed for future builds
     */
    performDeepCleanup(): void;
    loadSchematics(schematicDataMap: {
        [key: string]: () => Promise<ArrayBuffer>;
    }, propertiesMap?: {
        [key: string]: Partial<{
            position: THREE.Vector3 | number[];
            rotation: THREE.Euler | number[];
            scale: THREE.Vector3 | number[] | number;
            opacity: number;
            visible: boolean;
        }>;
    }): Promise<void>;
    loadSchematicFromFile(file: File, options?: {
        onProgress?: (progress: LoadingProgress) => void;
    }): Promise<void>;
    loadSchematicFromURL(url: string, name?: string, properties?: Partial<{
        position: THREE.Vector3 | number[];
        rotation: THREE.Euler | number[];
        scale: THREE.Vector3 | number[] | number;
        opacity: number;
        visible: boolean;
        focused: boolean;
    }>, options?: {
        onProgress?: (progress: LoadingProgress) => void;
    }): Promise<void>;
    removeSchematic(name: string): Promise<void>;
    addSchematic(schematic: SchematicObject): void;
    getSchematic(id: string): SchematicObject | undefined;
    getAllSchematics(): SchematicObject[];
    getFirstSchematic(): SchematicObject | undefined;
    getSchematicAtPosition(position: THREE.Vector3): SchematicObject | null;
    isEmpty(): boolean;
    schematicExists(id: string): boolean;
    getSchematicsAveragePosition(): THREE.Vector3;
    /**
     * Get the combined world-space bounding box of all schematics
     */
    getGlobalTightWorldBox(): THREE.Box3;
    getMaxSchematicDimensions(): THREE.Vector3;
    /**
     * Get maximum tight dimensions across all schematics
     * Uses actual block content, not pre-allocated space
     * Falls back to allocated dimensions if tight bounds are not available
     */
    getMaxSchematicTightDimensions(): THREE.Vector3;
    getGlobalBoundingBox(): [number[], number[]];
    getSelectableObjects(): THREE.Object3D[];
    createEmptySchematic(name: string, options?: Partial<{
        visible: boolean;
        position: THREE.Vector3 | number[];
    }>): SchematicObject;
}
export {};
//# sourceMappingURL=SchematicManager.d.ts.map