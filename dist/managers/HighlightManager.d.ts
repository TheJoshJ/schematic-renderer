import { Highlight } from "./highlight/Highlight";
import { CustomIoHighlight } from "./highlight/CustomIoHighlight";
import { InsignIoHoverHandler } from "./highlight/InsignIoHoverHandler";
import { SchematicRenderer } from "../SchematicRenderer";
export declare class HighlightManager {
    private highlights;
    private schematicRenderer;
    customIoHighlight: CustomIoHighlight | null;
    insignIoHoverHandler: InsignIoHoverHandler | null;
    constructor(schematicRenderer: SchematicRenderer);
    private loadHighlights;
    addHighlight(highlight: Highlight): void;
    removeHighlight(highlight: Highlight): void;
    dispose(): void;
    update(deltaTime: number): void;
}
//# sourceMappingURL=HighlightManager.d.ts.map