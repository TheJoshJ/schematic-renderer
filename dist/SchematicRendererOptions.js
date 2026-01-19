// SchematicRendererOptions.ts
export const DEFAULT_OPTIONS = {
    hdri: "",
    gamma: 0.5,
    chunkSideLength: 16, // Default chunk side length in blocks
    meshBuildingMode: "batched", // Default mesh building mode
    showCameraPathVisualization: false,
    enableAutoOrbit: false,
    autoOrbitDuration: 10,
    enableInteraction: false,
    enableDragAndDrop: false,
    enableGizmos: false,
    showGrid: false,
    showAxes: false,
    enableProgressBar: true,
    progressBarOptions: {
        showLabel: true,
        showPercentage: true,
        barColor: "#4CAF50", // Material green
        barHeight: 6,
        labelColor: "#ffffff",
        theme: "dark",
    },
    showRenderingBoundsHelper: false,
    targetFPS: 60, // 60 FPS when active
    idleFPS: 1, // 1 FPS when idle
    enableAdaptiveFPS: true, // Enable adaptive FPS by default
    idleThreshold: 100, // 100ms of inactivity before idle mode
    logFPS: false,
    callbacks: {},
    interactionOptions: {
        enableSelection: false,
        enableMovingSchematics: false,
    },
    dragAndDropOptions: {
        acceptedFileTypes: ["schematic", "nbt", "schem", "litematic", "mcstructure"],
    },
    gizmoOptions: {
        enableRotation: false,
        enableScaling: false,
    },
    cameraOptions: {
        position: [5, 5, 5],
        preserveCameraOnUpdate: false,
        useTightBounds: true,
    },
    simulationOptions: {
        enableSimulation: false,
        autoTickSpeed: 0,
        autoInitialize: false,
        autoSync: true,
    },
    keyboardControlsOptions: {
        enabled: true,
        flySpeed: 5.0, // 5 units per second
        sprintMultiplier: 2.5, // 2.5x speed when sprinting
        keybinds: {
            forward: "w",
            backward: "s",
            left: "a",
            right: "d",
            up: " ", // Space
            down: "Shift", // Shift
            sprint: "Shift", // Shift for sprint
        },
    },
    debugOptions: {
        enableInspector: false,
        showOnStartup: true,
        enableKeyboardShortcuts: true,
        toggleInspectorShortcut: "Backquote", // Backtick/tilde key
    },
    postProcessingOptions: {
        enabled: true,
        enableSSAO: true,
        enableSMAA: true,
        enableGamma: true,
    },
    gpuComputeOptions: {
        enabled: false, // Disabled by default - experimental and slower
        preferGPU: true,
    },
    wasmMeshBuilderOptions: {
        enabled: true, // Enabled by default - recommended for best performance
        greedyMeshingEnabled: false, // Disabled by default until fully tested
    },
    webgpuOptions: {
        preferWebGPU: false, // Disabled by default - WebGL is more widely supported
        forceWebGPU: false,
    },
    definitionRegionOptions: {
        showOnLoad: true, // Auto-show definition regions from schematic metadata
        defaultColor: 0x00ff88, // Green
        defaultOpacity: 0.25,
        showEdges: true,
        showLabels: true,
    },
    resourcePackOptions: {
        enableUI: true, // Enable resource pack management UI
        uiPosition: "top-right", // UI position
        autoRebuild: true, // Auto-rebuild atlas when packs change
        showIcons: true, // Show pack icons in UI
        enableDragReorder: true, // Enable drag-and-drop reordering
        enableKeyboardShortcuts: true, // Enable keyboard shortcuts
        toggleUIShortcut: "KeyP", // Press P to toggle UI
        maxPacks: 0, // 0 = unlimited
    },
    exportUIOptions: {
        enableUI: true, // Enable export UI panel
        uiPosition: "top-right", // UI position
        enableKeyboardShortcuts: true, // Enable keyboard shortcut to toggle UI
        toggleUIShortcut: "KeyE", // Press E to toggle UI
    },
    captureUIOptions: {
        enableUI: true, // Enable capture UI (screenshot/recording panel)
        uiPosition: "top-right", // UI position
        enableKeyboardShortcuts: true, // Enable keyboard shortcut to toggle UI
        toggleUIShortcut: "KeyC", // Press C to toggle UI
    },
    renderSettingsUIOptions: {
        enableUI: true, // Enable render settings UI panel
        uiPosition: "top-right", // UI position
        enableKeyboardShortcuts: true, // Enable keyboard shortcut to toggle UI
        toggleUIShortcut: "KeyR", // Press R to toggle UI
    },
    performanceDashboardOptions: {
        enabled: true, // Enable performance dashboard
        enableKeyboardShortcuts: true, // Enable keyboard shortcut to toggle dashboard
        toggleDashboardShortcut: { key: "KeyP", ctrl: true }, // Ctrl+P to toggle dashboard
    },
    resourcePackBlobs: [],
};
