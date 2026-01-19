import { SchematicRenderer } from "../SchematicRenderer";
import { KeyboardShortcut } from "../ui/UIComponents";
export interface GizmoShortcuts {
    /** Shortcut for translate mode (default: KeyG) */
    translate?: KeyboardShortcut;
    /** Shortcut for rotate mode (default: KeyR) */
    rotate?: KeyboardShortcut;
    /** Shortcut for scale mode (default: KeyS) */
    scale?: KeyboardShortcut;
    /** Shortcut to deselect/cancel (default: Escape) */
    deselect?: KeyboardShortcut;
}
export interface InteractionManagerOptions {
    enableSelection?: boolean;
    enableMovingSchematics?: boolean;
    /** Enable keyboard shortcuts for gizmo mode switching */
    enableKeyboardShortcuts?: boolean;
    /** Custom shortcuts for gizmo modes */
    gizmoShortcuts?: GizmoShortcuts;
}
export declare class InteractionManager {
    private schematicRenderer;
    private options;
    private raycaster;
    private mouse;
    private camera;
    private hoveredObject;
    private canvas;
    private selectedObject;
    private gizmoShortcuts;
    constructor(schematicRenderer: SchematicRenderer, options: InteractionManagerOptions);
    private addEventListeners;
    private onMouseMove;
    private onMouseDown;
    private onKeyDown;
    private updateMousePosition;
    private checkHover;
    private findSelectableParent;
    private visualizeBoundingBoxes;
    private checkSelection;
    private selectObject;
    private deselectObject;
    update(): void;
    dispose(): void;
}
//# sourceMappingURL=InteractionManager.d.ts.map