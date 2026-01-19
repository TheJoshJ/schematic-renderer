import { EventEmitter } from "events";
import type { SchematicWrapper } from "nucleation";
/**
 * Simulation synchronization modes
 * - 'synced': Every tick syncs to schematic (visual updates, slower)
 * - 'headless': No automatic syncing (fastest, manual sync when needed)
 * - 'io-only': Only syncs IO positions (good middle ground)
 */
export type SyncMode = "synced" | "headless" | "io-only";
/**
 * Options for initializing a simulation
 */
export interface SimulationConfig {
    /**
     * Synchronization mode
     * @default 'synced'
     */
    syncMode?: SyncMode;
    /**
     * Optimize compilation (exclude non-IO wires from graph)
     * Note: Must be false for custom IO power propagation to work!
     * @default false
     */
    optimize?: boolean;
    /**
     * Custom IO positions for power injection/monitoring
     * @default []
     */
    customIo?: Array<{
        x: number;
        y: number;
        z: number;
    }>;
    /**
     * Tick speed in ticks per second for auto-tick mode
     * @default 20
     */
    tickSpeed?: number;
}
export interface SimulationState {
    isRunning: boolean;
    tickCount: number;
    autoTickEnabled: boolean;
    tickSpeed: number;
    syncMode: SyncMode;
    customIoPositions: Array<{
        x: number;
        y: number;
        z: number;
    }>;
}
export interface CustomIoState {
    x: number;
    y: number;
    z: number;
    power: number;
    tick: number;
}
export type CustomIoCallback = (state: CustomIoState) => void;
export interface BlockStateChange {
    position: [number, number, number];
    blockName: string;
    oldState?: Record<string, string>;
    newState?: Record<string, string>;
}
export declare class SimulationManager {
    private eventEmitter;
    private simulationWorld;
    private schematic;
    private state;
    private autoTickInterval;
    private customIoCallbacks;
    constructor(eventEmitter: EventEmitter);
    /**
     * Initialize simulation for a schematic
     *
     * @example
     * // Visual mode with custom IO
     * await sim.initializeSimulation(schematic, {
     *   syncMode: 'synced',
     *   optimize: false,
     *   customIo: [{ x: 0, y: 1, z: 0 }]
     * });
     *
     * @example
     * // Performance mode - manual sync
     * await sim.initializeSimulation(schematic, {
     *   syncMode: 'headless',
     *   optimize: true
     * });
     *
     * @example
     * // IO-only mode - best of both worlds
     * await sim.initializeSimulation(schematic, {
     *   syncMode: 'io-only',
     *   optimize: false,
     *   customIo: [{ x: 0, y: 1, z: 0 }, { x: 4, y: 1, z: 1 }]
     * });
     */
    initializeSimulation(schematic: SchematicWrapper, config?: SimulationConfig): Promise<boolean>;
    /**
     * Tick the simulation forward
     *
     * @param numTicks - Number of ticks to advance
     * @param syncOverride - Override the default sync behavior:
     *   - 'auto': Use configured syncMode
     *   - 'force': Force sync regardless of mode
     *   - 'none': Skip sync regardless of mode
     *
     * @example
     * // Normal tick with auto-sync based on mode
     * sim.tick(1);
     *
     * @example
     * // Run 100 ticks in headless mode, then force sync
     * sim.tick(100, 'none');
     * sim.tick(0, 'force'); // Just sync, no ticks
     *
     * @example
     * // Run 10 ticks and force sync even in headless mode
     * sim.tick(10, 'force');
     */
    tick(numTicks?: number, syncOverride?: "auto" | "force" | "none"): void;
    /**
     * Manually sync simulation state to schematic
     * Useful in headless mode to periodically update visuals
     *
     * @returns The updated schematic, or null if sync failed
     *
     * @example
     * // Run 1000 ticks headless, then sync once
     * for (let i = 0; i < 1000; i++) {
     *   sim.tick(1, 'none');
     * }
     * const updated = sim.syncToSchematic();
     */
    syncToSchematic(): SchematicWrapper | null;
    /**
     * Change the synchronization mode at runtime
     *
     * @example
     * // Start in synced mode for debugging
     * sim.setSyncMode('synced');
     * sim.tick(10);
     *
     * // Switch to headless for performance
     * sim.setSyncMode('headless');
     * sim.tick(1000);
     *
     * // Manually sync to see results
     * sim.syncToSchematic();
     */
    setSyncMode(mode: SyncMode): void;
    /**
     * Get current simulation state
     */
    getState(): SimulationState;
    /**
     * Check if simulation is active
     */
    isSimulationActive(): boolean;
    /**
     * Set signal strength at a custom IO position
     *
     * @example
     * // Inject power into input wire
     * sim.setSignalStrength(0, 1, 0, 15); // Full power
     * sim.tick(5); // Propagate
     */
    setSignalStrength(x: number, y: number, z: number, strength: number): boolean;
    /**
     * Get signal strength at a custom IO position
     *
     * @example
     * // Read power from output wire
     * const power = sim.getSignalStrength(4, 1, 1);
     * console.log(`Output power: ${power}`);
     */
    getSignalStrength(x: number, y: number, z: number): number;
    /**
     * Add a custom IO position at runtime
     */
    addCustomIoPosition(x: number, y: number, z: number): void;
    /**
     * Remove a custom IO position
     */
    removeCustomIoPosition(x: number, y: number, z: number): void;
    /**
     * Clear all custom IO positions
     */
    clearCustomIoPositions(): void;
    /**
     * Get all custom IO positions
     */
    getCustomIoPositions(): Array<{
        x: number;
        y: number;
        z: number;
    }>;
    /**
     * Register a callback for custom IO state changes
     * @param x X coordinate
     * @param y Y coordinate
     * @param z Z coordinate
     * @param callback Function to call when IO state changes
     * @returns Unsubscribe function
     */
    onCustomIoChange(x: number, y: number, z: number, callback: CustomIoCallback): () => void;
    /**
     * Check for custom IO state changes and trigger callbacks
     * Uses nucleation's built-in callback system for zero-overhead change detection
     * Call this after tick() or setSignalStrength()
     */
    private checkCustomIoChanges;
    /**
     * Interact with a block (e.g., toggle lever, button)
     */
    interactWithBlock(x: number, y: number, z: number): Promise<SchematicWrapper | null>;
    /**
     * Start automatic ticking at configured tick speed
     *
     * @example
     * // Start auto-ticking at 20 TPS (Minecraft default)
     * sim.startAutoTick();
     *
     * // Change speed to 10 TPS
     * sim.setTickSpeed(10);
     */
    startAutoTick(): void;
    /**
     * Stop automatic ticking
     */
    stopAutoTick(): void;
    /**
     * Change tick speed (takes effect on next auto-tick cycle)
     */
    setTickSpeed(ticksPerSecond: number): void;
    /**
     * Reset simulation to initial state
     */
    reset(): void;
    /**
     * Clean up and destroy simulation
     */
    destroy(): void;
    /**
     * Get the underlying schematic (without syncing)
     */
    getSchematic(): SchematicWrapper | null;
}
//# sourceMappingURL=SimulationManager.d.ts.map