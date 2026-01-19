import { HoverHighlight } from "./highlight/HoverHighlight";
import { AnnotationHighlight } from "./highlight/AnnotationHighlight";
import { ClickInteractionHandler } from "./highlight/ClickInteractionHandler";
import { CustomIoHighlight } from "./highlight/CustomIoHighlight";
import { InsignIoHoverHandler } from "./highlight/InsignIoHoverHandler";
export class HighlightManager {
    constructor(schematicRenderer) {
        Object.defineProperty(this, "highlights", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "schematicRenderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "customIoHighlight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "insignIoHoverHandler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.schematicRenderer = schematicRenderer;
        this.loadHighlights();
    }
    loadHighlights() {
        // Instantiate and add all highlight types here
        const hoverHighlight = new HoverHighlight(this.schematicRenderer);
        this.addHighlight(hoverHighlight);
        const annotationHighlight = new AnnotationHighlight(this.schematicRenderer);
        this.addHighlight(annotationHighlight);
        // Add click interaction handler for block interactions
        const clickHandler = new ClickInteractionHandler(this.schematicRenderer);
        this.addHighlight(clickHandler);
        // Add custom IO highlight for simulation custom IO nodes
        this.customIoHighlight = new CustomIoHighlight(this.schematicRenderer);
        this.addHighlight(this.customIoHighlight);
        // Add Insign IO hover handler for showing IO metadata overlays
        this.insignIoHoverHandler = new InsignIoHoverHandler(this.schematicRenderer);
        this.addHighlight(this.insignIoHoverHandler);
        // Add other highlights as needed
    }
    addHighlight(highlight) {
        this.highlights.push(highlight);
        highlight.activate();
    }
    removeHighlight(highlight) {
        highlight.deactivate();
        this.highlights = this.highlights.filter((h) => h !== highlight);
    }
    dispose() {
        this.highlights.forEach((highlight) => highlight.deactivate());
    }
    update(deltaTime) {
        this.highlights.forEach((highlight) => highlight.update(deltaTime));
    }
}
