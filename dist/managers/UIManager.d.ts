import { SchematicRenderer } from "../SchematicRenderer";
export declare class UIManager {
    private renderer;
    private overlay;
    private loadingIndicator;
    private messageBox;
    private progressBar;
    private progressBarContainer;
    private progressLabel;
    private progressText;
    emptyStateOverlay: HTMLDivElement;
    private fpvOverlay;
    private fpvMenu;
    private keydownHandler;
    private progressOptions;
    createFPVElements(): {
        menu: HTMLDivElement;
        blocker: HTMLDivElement;
    };
    showFPVOverlay(): void;
    hideFPVOverlay(): void;
    constructor(renderer: SchematicRenderer);
    showEmptyState(): void;
    hideEmptyState(): void;
    private createUploadStateOverlay;
    private createOverlay;
    showProgressBar(label?: string): void;
    hideProgressBar(): void;
    isProgressBarVisible(): boolean;
    updateProgress(progress: number, message?: string): void;
    showOverlay(): void;
    hideOverlay(): void;
    showLoadingIndicator(message?: string): void;
    hideLoadingIndicator(): void;
    showMessage(message: string, duration?: number): void;
    dispose(): void;
}
//# sourceMappingURL=UIManager.d.ts.map