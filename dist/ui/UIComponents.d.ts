export type UIPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
/**
 * Represents a keyboard shortcut with optional modifier keys.
 * Can be specified as:
 * - A simple string like "KeyC" or "KeyR" (just the key code)
 * - An object with key and modifiers like { key: "KeyC", alt: true }
 */
export interface KeyboardShortcutConfig {
    /** The key code (e.g., "KeyC", "KeyR", "Backquote", "Escape") */
    key: string;
    /** Require Alt key to be held */
    alt?: boolean;
    /** Require Ctrl key to be held */
    ctrl?: boolean;
    /** Require Shift key to be held */
    shift?: boolean;
    /** Require Meta/Cmd key to be held */
    meta?: boolean;
}
/** A keyboard shortcut can be a simple key code string or a full config object */
export type KeyboardShortcut = string | KeyboardShortcutConfig;
/**
 * Normalizes a keyboard shortcut to the full config format.
 * @param shortcut - A string key code or KeyboardShortcutConfig
 * @returns The normalized KeyboardShortcutConfig
 */
export declare function normalizeShortcut(shortcut: KeyboardShortcut): KeyboardShortcutConfig;
/**
 * Checks if a keyboard event matches the given shortcut configuration.
 * @param event - The keyboard event to check
 * @param shortcut - The shortcut to match against
 * @returns True if the event matches the shortcut
 */
export declare function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean;
/**
 * Formats a keyboard shortcut for display (e.g., "Alt+C", "Ctrl+Shift+P")
 * @param shortcut - The shortcut to format
 * @returns A human-readable string representation
 */
export declare function formatShortcut(shortcut: KeyboardShortcut): string;
export interface BaseUIOptions {
    enableUI?: boolean;
    uiPosition?: UIPosition;
    enableKeyboardShortcuts?: boolean;
    toggleUIShortcut?: KeyboardShortcut;
}
/**
 * Shared color palette for consistent UI styling
 */
export declare const UIColors: {
    panelBackground: string;
    headerBackground: string;
    inputBackground: string;
    hoverBackground: string;
    activeBackground: string;
    border: string;
    inputBorder: string;
    activeBorder: string;
    text: string;
    textMuted: string;
    textDim: string;
    primary: string;
    primaryHover: string;
    success: string;
    warning: string;
    danger: string;
    shadow: string;
};
/**
 * Shared styles for common UI elements
 */
export declare const UIStyles: {
    panel: {
        position: "absolute";
        width: string;
        backgroundColor: string;
        borderRadius: string;
        boxShadow: string;
        fontFamily: string;
        fontSize: string;
        color: string;
        zIndex: string;
        display: string;
        overflow: string;
        border: string;
    };
    header: {
        display: string;
        justifyContent: string;
        alignItems: string;
        padding: string;
        borderBottom: string;
        background: string;
    };
    content: {
        padding: string;
        display: string;
        flexDirection: "column";
        gap: string;
        maxHeight: string;
        overflowY: "auto";
    };
    section: {
        borderBottom: string;
        paddingBottom: string;
        marginBottom: string;
    };
    sectionTitle: {
        fontSize: string;
        fontWeight: "600";
        textTransform: "uppercase";
        color: string;
        marginBottom: string;
        letterSpacing: string;
    };
    label: {
        display: string;
        fontSize: string;
        fontWeight: "500";
        marginBottom: string;
        color: string;
    };
    input: {
        width: string;
        padding: string;
        border: string;
        borderRadius: string;
        backgroundColor: string;
        color: string;
        fontSize: string;
        outline: string;
        boxSizing: "border-box";
    };
    select: {
        width: string;
        padding: string;
        border: string;
        borderRadius: string;
        backgroundColor: string;
        color: string;
        fontSize: string;
        outline: string;
        cursor: string;
    };
    button: {
        padding: string;
        border: string;
        borderRadius: string;
        backgroundColor: string;
        color: string;
        cursor: string;
        fontSize: string;
        fontWeight: "500";
        transition: string;
    };
    buttonSecondary: {
        padding: string;
        border: string;
        borderRadius: string;
        backgroundColor: string;
        color: string;
        cursor: string;
        fontSize: string;
        transition: string;
    };
    iconButton: {
        width: string;
        height: string;
        border: string;
        borderRadius: string;
        backgroundColor: string;
        color: string;
        cursor: string;
        fontSize: string;
        transition: string;
    };
    footer: {
        padding: string;
        borderTop: string;
        display: string;
        justifyContent: string;
        alignItems: string;
        gap: string;
    };
};
/**
 * Get position styles based on UIPosition
 */
export declare function getPositionStyles(position: UIPosition): Record<string, string>;
/**
 * Create a styled label element
 */
export declare function createLabel(text: string): HTMLLabelElement;
/**
 * Create a styled select element
 */
export declare function createSelect(options: {
    value: string;
    label: string;
}[], defaultValue: string, onChange?: (value: string) => void): HTMLSelectElement;
/**
 * Create a styled number input with optional range controls
 */
export declare function createNumberInput(value: number, options?: {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    onChange?: (value: number) => void;
}): HTMLDivElement;
/**
 * Create a styled toggle switch
 */
export declare function createToggle(isOn: boolean, onChange?: (enabled: boolean) => void | Promise<void>): HTMLLabelElement;
/**
 * Create a styled checkbox
 */
export declare function createCheckbox(id: string, labelText: string, checked: boolean, onChange?: (checked: boolean) => void, tooltip?: string): HTMLLabelElement;
/**
 * Create a styled icon button
 */
export declare function createIconButton(icon: string, title: string, onClick: () => void): HTMLButtonElement;
/**
 * Create a styled primary button
 */
export declare function createButton(text: string, onClick: () => void, options?: {
    primary?: boolean;
    disabled?: boolean;
}): HTMLButtonElement;
/**
 * Create a color picker input
 */
export declare function createColorPicker(value: string, onChange?: (color: string) => void): HTMLDivElement;
/**
 * Create a slider with value display
 */
export declare function createSlider(value: number, options?: {
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    formatValue?: (val: number) => string;
    onChange?: (value: number) => void;
}): HTMLDivElement;
/**
 * Create a row with label and control
 */
export declare function createSettingRow(labelText: string, control: HTMLElement, options?: {
    tooltip?: string;
    fullWidth?: boolean;
}): HTMLDivElement;
/**
 * Create section title
 */
export declare function createSectionTitle(text: string): HTMLDivElement;
/**
 * Base class for UI panels
 */
export declare abstract class BaseUI {
    protected container: HTMLDivElement;
    protected isVisible: boolean;
    protected canvas: HTMLCanvasElement;
    protected options: BaseUIOptions;
    protected keydownHandler: ((e: KeyboardEvent) => void) | null;
    constructor(canvas: HTMLCanvasElement, options?: BaseUIOptions);
    protected createContainer(): HTMLDivElement;
    protected createHeader(title: string, icon?: string): HTMLDivElement;
    protected setupKeyboardShortcuts(): void;
    show(): void;
    hide(): void;
    toggle(): void;
    isShowing(): boolean;
    destroy(): void;
    dispose(): void;
}
//# sourceMappingURL=UIComponents.d.ts.map