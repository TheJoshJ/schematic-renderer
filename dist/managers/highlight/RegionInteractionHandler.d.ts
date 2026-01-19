import { SchematicRenderer } from "../../SchematicRenderer";
export declare class RegionInteractionHandler {
    private renderer;
    private raycaster;
    private mouse;
    private hoveredHandle;
    private draggingHandle;
    private dragOffset;
    private activeRegion;
    private dragPlane;
    private originalHandleColor;
    private hoverHandleColor;
    constructor(renderer: SchematicRenderer);
    private updateMouse;
    private onMouseMove;
    private checkHover;
    private clearHover;
    private setHandleColor;
    private onMouseDown;
    private startDrag;
    private handleDrag;
    private onMouseUp;
    dispose(): void;
}
//# sourceMappingURL=RegionInteractionHandler.d.ts.map