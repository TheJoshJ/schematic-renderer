import { ResourcePackManager } from "../managers/ResourcePackManager";
import { ResourcePackOptions } from "../types/resourcePack";
/**
 * Resource Pack Management UI Component
 * Provides a visual interface for managing resource packs with drag-and-drop reordering
 */
export declare class ResourcePackUI {
    private manager;
    private container;
    private packList;
    private isVisible;
    private options;
    private canvas;
    private draggedPackId;
    constructor(manager: ResourcePackManager, canvas: HTMLCanvasElement, options?: ResourcePackOptions);
    private createContainer;
    private createHeader;
    private createPackList;
    private createIconButton;
    private subscribeToEvents;
    private setupKeyboardShortcuts;
    render(): void;
    private createEmptyState;
    private createPackItem;
    private createToggleSwitch;
    private createFooter;
    private setupDragEvents;
    private triggerFileUpload;
    show(): void;
    hide(): void;
    toggle(): void;
    isShowing(): boolean;
    destroy(): void;
    /**
     * Dispose of the UI (alias for destroy)
     */
    dispose(): void;
}
//# sourceMappingURL=ResourcePackUI.d.ts.map