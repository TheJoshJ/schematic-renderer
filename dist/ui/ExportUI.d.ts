import { SchematicExporter } from "../export/SchematicExporter";
import { SchematicObject } from "../managers/SchematicObject";
import { ExportUIOptions, ExportFormat } from "../types/export";
/**
 * Export UI Component
 * Provides a visual interface for exporting schematics with various options
 */
export declare class ExportUI {
    private exporter;
    private container;
    private isVisible;
    private options;
    private canvas;
    private getSchematic;
    private formatSelect;
    private qualitySelect;
    private normalModeSelect;
    private filenameInput;
    private progressBar;
    private progressText;
    private exportButton;
    private isExporting;
    private currentResult;
    constructor(canvas: HTMLCanvasElement, getSchematic: () => SchematicObject | null, options?: ExportUIOptions);
    private createContainer;
    private createHeader;
    private createContent;
    private createFilenameSection;
    private createFormatSection;
    private createQualitySection;
    private createNormalModeSection;
    private createOptionsSection;
    private createProgressSection;
    private createFooter;
    private createLabel;
    private createSelect;
    private createCheckbox;
    private createIconButton;
    private getFormatLabel;
    private setupEventListeners;
    private setupKeyboardShortcuts;
    private getExportOptions;
    private startExport;
    private cancelExport;
    private setExportingState;
    private updateProgress;
    private handleExportComplete;
    private handleExportError;
    private showError;
    private formatFileSize;
    show(): void;
    hide(): void;
    toggle(): void;
    isShowing(): boolean;
    destroy(): void;
    dispose(): void;
    /**
     * Get the exporter instance for programmatic use
     */
    getExporter(): SchematicExporter;
    /**
     * Set default filename
     */
    setFilename(filename: string): void;
    /**
     * Set default format
     */
    setFormat(format: ExportFormat): void;
}
//# sourceMappingURL=ExportUI.d.ts.map