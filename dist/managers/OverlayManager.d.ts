import { EventEmitter } from "events";
import { SchematicRenderer } from "../SchematicRenderer";
export interface OverlayContent {
    title: string;
    subtitle?: string;
    sections: OverlaySection[];
}
export interface OverlaySection {
    title?: string;
    items: OverlayItem[];
}
export interface OverlayItem {
    label: string;
    value: string | number | boolean;
    color?: string;
    icon?: string;
}
export interface OverlayPosition {
    x: number;
    y: number;
}
/**
 * Manager for displaying contextual overlays on hover/click
 * Provides a unified system for showing metadata about regions, blocks, entities, etc.
 */
export declare class OverlayManager extends EventEmitter {
    private overlayElement;
    private isVisible;
    private currentContent;
    constructor(_renderer: SchematicRenderer);
    /**
     * Create the overlay DOM element
     */
    private createOverlayElement;
    /**
     * Show overlay with content at a specific position
     */
    show(content: OverlayContent, position: OverlayPosition): void;
    /**
     * Update overlay position
     */
    updatePosition(position: OverlayPosition): void;
    /**
     * Hide the overlay
     */
    hide(): void;
    /**
     * Check if overlay is currently visible
     */
    isShowing(): boolean;
    /**
     * Get current overlay content
     */
    getCurrentContent(): OverlayContent | null;
    /**
     * Format a value for display
     */
    private formatValue;
    /**
     * Escape HTML to prevent XSS
     */
    private escapeHtml;
    /**
     * Dispose and clean up
     */
    dispose(): void;
}
//# sourceMappingURL=OverlayManager.d.ts.map