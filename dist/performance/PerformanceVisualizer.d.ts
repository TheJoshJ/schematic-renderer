export interface VisualizationConfig {
    container: HTMLElement;
    width?: number;
    height?: number;
    theme?: "light" | "dark";
    showLiveFPS?: boolean;
    updateInterval?: number;
}
export declare class PerformanceVisualizer {
    private container;
    private config;
    private fpsMonitor;
    private charts;
    private isVisible;
    private onMeshModeChange?;
    constructor(config: VisualizationConfig);
    private setupContainer;
    private createCharts;
    private startFPSMonitoring;
    show(): void;
    hide(): void;
    toggle(): void;
    updateCharts(): void;
    private exportData;
    private clearData;
    setMeshModeChangeCallback(callback: (mode: "immediate" | "incremental" | "instanced") => void): void;
    destroy(): void;
}
//# sourceMappingURL=PerformanceVisualizer.d.ts.map