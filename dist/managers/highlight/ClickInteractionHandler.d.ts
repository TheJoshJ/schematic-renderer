import { SchematicRenderer } from "../../SchematicRenderer";
import { Highlight } from "./Highlight";
export declare class ClickInteractionHandler implements Highlight {
    private schematicRenderer;
    private raycaster;
    private mouse;
    private canvas;
    private debugHelpers;
    constructor(schematicRenderer: SchematicRenderer);
    private clearDebugHelpers;
    activate(): void;
    deactivate(): void;
    update(_deltaTime: number): void;
    private onClick;
}
//# sourceMappingURL=ClickInteractionHandler.d.ts.map