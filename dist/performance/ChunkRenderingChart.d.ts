import { ChunkRenderingPhase } from "./PerformanceMonitor";
export interface ChunkAnalysisData {
    chunkId: string;
    chunkCoords: [number, number, number];
    totalTime: number;
    blockCount: number;
    phases: ChunkRenderingPhase[];
    geometryStats: {
        facesCulled: number;
        facesGenerated: number;
        cullingEfficiency: number;
        averageVerticesPerBlock: number;
    };
    memoryBreakdown: {
        vertexBuffers: number;
        indexBuffers: number;
        materials: number;
        textures: number;
        other: number;
    };
}
export declare class ChunkRenderingChart {
    private container;
    private svg;
    private tooltip;
    private theme;
    private width;
    private height;
    private margin;
    constructor(container: HTMLElement, theme?: "light" | "dark");
    private setupContainer;
    private createTooltip;
    updateData(chunkData: ChunkAnalysisData[]): void;
    private showNoDataMessage;
    private renderTimelineChart;
    private addLegend;
    private showChunkTooltip;
    private showPhaseTooltip;
    private hideTooltip;
    destroy(): void;
}
//# sourceMappingURL=ChunkRenderingChart.d.ts.map