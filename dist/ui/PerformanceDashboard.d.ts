import { PerformanceDashboardOptions } from "../SchematicRendererOptions";
export declare class PerformanceDashboard {
    private container;
    private isVisible;
    private updateInterval;
    private options;
    private toggleShortcut;
    private keydownHandler;
    constructor(options?: PerformanceDashboardOptions);
    private createDashboard;
    private setupEventListeners;
    show(): void;
    hide(): void;
    toggle(): void;
    isShowing(): boolean;
    private startUpdating;
    private stopUpdating;
    private updateContent;
    showSessionSummary(sessionData: any): void;
    /**
     * Reconfigure the dashboard with new options.
     * This updates the keyboard shortcut configuration.
     */
    configure(options: PerformanceDashboardOptions): void;
}
export declare const performanceDashboard: PerformanceDashboard;
//# sourceMappingURL=PerformanceDashboard.d.ts.map