import { EventEmitter } from "events";
import { SchematicManager } from "../SchematicManager";
import { SimulationManager } from "../SimulationManager";
export declare class BlockInteractionHandler {
    private eventEmitter;
    private simulationManager;
    constructor(eventEmitter: EventEmitter, _schematicManager: SchematicManager, simulationManager?: SimulationManager | null);
    private onInteractBlock;
    private processInteraction;
    private handleSimulatedInteraction;
    private toggleLever;
    dispose(): void;
}
//# sourceMappingURL=BlockInteractionHandler.d.ts.map