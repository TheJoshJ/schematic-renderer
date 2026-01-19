import { Highlight } from "../highlight/Highlight";
import { SchematicRenderer } from "../../SchematicRenderer";
export declare class AnnotationHighlight implements Highlight {
    private schematicRenderer;
    private annotations;
    private annotationInput;
    private raycaster;
    private mouse;
    private hoverPosition;
    constructor(schematicRenderer: SchematicRenderer);
    private onAddAnnotation;
    activate(): void;
    deactivate(): void;
    update(deltaTime: number): void;
    private createAnnotationInput;
    private showAnnotationInput;
    private hideAnnotationInput;
    private submitAnnotation;
    private addAnnotation;
    private removeAnnotation;
    private clearAllAnnotations;
    private updateAnnotationVisibility;
}
//# sourceMappingURL=AnnotationHighlight.d.ts.map