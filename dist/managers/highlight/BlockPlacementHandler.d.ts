import { EventEmitter } from "events";
import { SchematicManager } from "../SchematicManager";
export declare class BlockPlacementHandler {
    private eventEmitter;
    private schematicManager;
    constructor(eventEmitter: EventEmitter, schematicManager: SchematicManager);
    private onPlaceBlock;
    dispose(): void;
}
//# sourceMappingURL=BlockPlacementHandler.d.ts.map