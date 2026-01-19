import { Highlight } from "../highlight/Highlight";
import { SchematicRenderer } from "../../SchematicRenderer";
export declare class CustomIoHighlight implements Highlight {
    private schematicRenderer;
    private markers;
    private visible;
    constructor(schematicRenderer: SchematicRenderer);
    private onCustomIoPositionsChanged;
    private onSimulationInitialized;
    activate(): void;
    deactivate(): void;
    setVisible(visible: boolean): void;
    update(_deltaTime: number): void;
    private updateMarkers;
    private addMarker;
    private removeMarker;
    private clearAllMarkers;
    /**
     * Public method to add a custom IO marker at a position
     */
    addCustomIoMarker(x: number, y: number, z: number): void;
    /**
     * Public method to remove a custom IO marker at a position
     */
    removeCustomIoMarker(x: number, y: number, z: number): void;
    /**
     * Public method to clear all custom IO markers
     */
    clearCustomIoMarkers(): void;
}
//# sourceMappingURL=CustomIoHighlight.d.ts.map