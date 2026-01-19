import { Highlight } from "./Highlight";
import { SchematicRenderer } from "../../SchematicRenderer";
/**
 * Hover handler for Insign IO regions
 * Shows overlay with IO metadata when hovering over IO blocks
 */
export declare class InsignIoHoverHandler implements Highlight {
    private renderer;
    private isActive;
    private raycaster;
    private mouse;
    private currentHoveredRegion;
    constructor(renderer: SchematicRenderer);
    getName(): string;
    activate(): void;
    deactivate(): void;
    update(_deltaTime: number): void;
    private onMouseMove;
    /**
     * Find which IO region is currently being hovered
     */
    private findHoveredIoRegion;
    /**
     * Check if mouse is hovering over a specific block position
     */
    private isHoveringBlock;
    /**
     * Show overlay for a specific IO region
     */
    private showOverlayForRegion;
    /**
     * Hide the overlay
     */
    private hideOverlay;
}
//# sourceMappingURL=InsignIoHoverHandler.d.ts.map