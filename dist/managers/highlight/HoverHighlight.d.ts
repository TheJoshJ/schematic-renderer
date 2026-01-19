import { Highlight } from "./Highlight";
import { SchematicRenderer } from "../../SchematicRenderer";
export declare class HoverHighlight implements Highlight {
    private schematicRenderer;
    private hoverMesh;
    private raycaster;
    private mouse;
    private lastHoveredObject;
    constructor(schematicRenderer: SchematicRenderer);
    activate(): void;
    deactivate(): void;
    update(deltaTime: number): void;
    private onHoverEnter;
    private onHoverExit;
    private removeHoverMesh;
    private getBlockData;
}
//# sourceMappingURL=HoverHighlight.d.ts.map