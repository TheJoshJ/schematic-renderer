import * as THREE from "three";
export declare class Grid extends THREE.Object3D {
    private majorGrid;
    private minorGrid;
    private majorStep;
    private gridSize;
    private fadeDistance;
    private getLine;
    constructor(camera: THREE.Camera, gridSize?: number, majorStep?: number, minorStep?: number, majorColor?: number, minorColor?: number, fadeDistance?: number);
    private createGridLines;
    private getGridLines;
    /**
     * Adds labels at major grid intersections.
     */
    private addLabels;
    /**
     * Creates and adds a label sprite to the grid.
     * @param text The text to display.
     * @param position The position of the label.
     * @param color The color of the text.
     */
    private addLabel;
    update(): void;
}
//# sourceMappingURL=Grid.d.ts.map