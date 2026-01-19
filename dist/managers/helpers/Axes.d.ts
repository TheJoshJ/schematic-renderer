import * as THREE from "three";
export declare class Axes extends THREE.Object3D {
    private axes;
    private labels;
    private camera;
    constructor(size: number | undefined, camera: THREE.Camera);
    /**
     * Adds labels for the X, Y, and Z axes.
     * @param size The size of the axes.
     */
    private addLabels;
    /**
     * Creates and adds a label sprite to the axes.
     * @param text The text to display.
     * @param position The position of the label.
     * @param color The color of the text.
     */
    private addLabel;
    /**
     * Ensures all labels face the camera.
     */
    private updateLabels;
    /**
     * Call this method in your animation loop to keep the labels updated.
     */
    update(): void;
    /**
     * Sets the visibility of the axes and labels.
     * @param visible Whether the axes should be visible.
     */
    setVisible(visible: boolean): void;
}
//# sourceMappingURL=Axes.d.ts.map