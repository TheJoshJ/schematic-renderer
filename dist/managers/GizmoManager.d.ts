import { SchematicRenderer } from "../SchematicRenderer";
export interface GizmoManagerOptions {
    enableRotation?: boolean;
    enableScaling?: boolean;
}
export declare class GizmoManager {
    private transformControls;
    private schematicRenderer;
    private boundingBoxHelper;
    constructor(schematicRenderer: SchematicRenderer);
    private setupEventListeners;
    detach(): void;
    private onObjectSelected;
    private onObjectDeselected;
    setMode(mode: "translate" | "rotate" | "scale"): void;
    private handleTransformError;
    update(): void;
    dispose(): void;
}
//# sourceMappingURL=GizmoManager.d.ts.map