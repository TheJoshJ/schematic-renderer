import { SchematicRenderer } from "../SchematicRenderer";
export interface DragAndDropManagerOptions {
    acceptedFileTypes?: string[];
    callbacks?: {
        onSchematicLoaded?: (schematicName: string) => void;
        onSchematicDropped?: (file: File) => void | Promise<void>;
        onSchematicDropSuccess?: (file: File) => void | Promise<void>;
        onSchematicDropFailed?: (file: File, error: Error) => void | Promise<void>;
        onResourcePackLoaded?: (packName: string) => void | Promise<void>;
        onResourcePackDropped?: (file: File) => void | Promise<void>;
        onResourcePackDropSuccess?: (file: File) => void | Promise<void>;
        onResourcePackDropFailed?: (file: File, error: Error) => void | Promise<void>;
        onInvalidFileType?: (file: File) => void | Promise<void>;
        onLoadingProgress?: (file: File, progress: number) => void | Promise<void>;
    };
}
export declare class DragAndDropManager {
    private renderer;
    private options;
    private canvas;
    private uiManager;
    constructor(renderer: SchematicRenderer, options: DragAndDropManagerOptions);
    private initialize;
    private onDragOver;
    private onDragLeave;
    private onDrop;
    private handleSchematicDrop;
    private handleResourcePackDrop;
    private isAcceptedFileType;
    dispose(): void;
}
//# sourceMappingURL=DragAndDropManager.d.ts.map