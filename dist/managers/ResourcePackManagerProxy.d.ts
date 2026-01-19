import { ResourcePackManager } from "./ResourcePackManager";
import { ResourcePackInfo, PackFetchOptions, PackValidationResult, PackConfig, AssetConflict, PackMemoryUsage, PackEventType, PackEventHandler } from "../types/resourcePack";
/**
 * Proxy class that provides a clean external API for resource pack management.
 * This is the recommended way to interact with resource packs from application code.
 *
 * @example
 * ```typescript
 * // Access via SchematicRenderer
 * const packs = renderer.packs;
 *
 * // Load a resource pack
 * const packId = await packs.loadPackFromUrl('https://example.com/pack.zip', {
 *   name: 'My Pack',
 *   priority: 1
 * });
 *
 * // Listen for changes
 * packs.onPackEvent('packsChanged', () => {
 *   console.log('Packs changed, scene needs rebuild');
 * });
 *
 * // Get all packs
 * const allPacks = packs.getAllPacks();
 * ```
 */
export declare class ResourcePackManagerProxy {
    private manager;
    constructor(manager: ResourcePackManager);
    /**
     * Load a resource pack from a URL.
     *
     * @param url - The URL to fetch the pack from
     * @param options - Loading options
     * @returns Promise resolving to the pack ID
     *
     * @example
     * ```typescript
     * const packId = await packs.loadPackFromUrl('https://example.com/pack.zip', {
     *   name: 'My Resource Pack',
     *   priority: 0,
     *   onProgress: (loaded, total) => console.log(`${loaded}/${total}`)
     * });
     * ```
     */
    loadPackFromUrl(url: string, options?: PackFetchOptions): Promise<string>;
    /**
     * Load a resource pack from a Blob.
     *
     * @param blob - The blob containing the pack data
     * @param name - Optional display name for the pack
     * @returns Promise resolving to the pack ID
     */
    loadPackFromBlob(blob: Blob, name?: string): Promise<string>;
    /**
     * Load a resource pack from a File (e.g., from file input or drag-and-drop).
     *
     * @param file - The file to load
     * @returns Promise resolving to the pack ID
     *
     * @example
     * ```typescript
     * const fileInput = document.querySelector('input[type="file"]');
     * fileInput.addEventListener('change', async (e) => {
     *   const file = e.target.files[0];
     *   const packId = await packs.loadPackFromFile(file);
     * });
     * ```
     */
    loadPackFromFile(file: File): Promise<string>;
    /**
     * Remove a pack by ID.
     *
     * @param packId - The ID of the pack to remove
     */
    removePack(packId: string): Promise<void>;
    /**
     * Remove all loaded packs.
     */
    removeAllPacks(): Promise<void>;
    /**
     * Enable a pack (makes it active for rendering).
     *
     * @param packId - The ID of the pack to enable
     */
    enablePack(packId: string): Promise<void>;
    /**
     * Disable a pack (removes from rendering without unloading).
     *
     * @param packId - The ID of the pack to disable
     */
    disablePack(packId: string): Promise<void>;
    /**
     * Toggle a pack's enabled state.
     *
     * @param packId - The ID of the pack to toggle
     * @returns The new enabled state
     */
    togglePack(packId: string): Promise<boolean>;
    /**
     * Set a pack's priority level.
     * Higher priority packs override lower priority packs for conflicting assets.
     *
     * @param packId - The ID of the pack
     * @param priority - The new priority level
     */
    setPackPriority(packId: string, priority: number): Promise<void>;
    /**
     * Move a pack up in priority (increase priority).
     *
     * @param packId - The ID of the pack to move up
     */
    movePackUp(packId: string): Promise<void>;
    /**
     * Move a pack down in priority (decrease priority).
     *
     * @param packId - The ID of the pack to move down
     */
    movePackDown(packId: string): Promise<void>;
    /**
     * Reorder all packs based on an array of IDs.
     * Useful for implementing drag-and-drop reordering UI.
     *
     * @param packIds - Array of pack IDs in the desired order
     *
     * @example
     * ```typescript
     * // After drag-drop reordering in UI:
     * await packs.reorderPacks([packId1, packId2, packId3]);
     * ```
     */
    reorderPacks(packIds: string[]): Promise<void>;
    /**
     * Get information about a specific pack.
     *
     * @param packId - The ID of the pack
     * @returns Pack info or null if not found
     */
    getPackInfo(packId: string): ResourcePackInfo | null;
    /**
     * Get all loaded packs, sorted by priority.
     *
     * @returns Array of pack information
     */
    getAllPacks(): ResourcePackInfo[];
    /**
     * Get only enabled packs, sorted by priority.
     *
     * @returns Array of enabled pack information
     */
    getEnabledPacks(): ResourcePackInfo[];
    /**
     * Get the total number of loaded packs.
     */
    getPackCount(): number;
    /**
     * Get all assets in a specific pack.
     *
     * @param packId - The ID of the pack
     * @returns Object with arrays of texture, blockstate, and model paths
     */
    getPackAssets(packId: string): Promise<{
        textures: string[];
        blockstates: string[];
        models: string[];
    }>;
    /**
     * Find which pack provides a specific asset.
     *
     * @param path - The asset path (e.g., 'block/stone')
     * @param type - The type of asset
     * @returns Pack ID of the provider, or null if not found
     */
    getAssetSource(path: string, type: "texture" | "blockstate" | "model"): Promise<string | null>;
    /**
     * Get all asset conflicts between enabled packs.
     *
     * @returns Array of conflict information
     */
    getAssetConflicts(): Promise<AssetConflict[]>;
    /**
     * Get a preview data URL for a texture from a specific pack.
     *
     * @param packId - The ID of the pack
     * @param texturePath - The texture path (e.g., 'block/stone')
     * @returns Data URL of the texture, or null if not found
     */
    previewPackTexture(packId: string, texturePath: string): Promise<string | null>;
    /**
     * Subscribe to a pack event.
     *
     * @param event - The event type to listen for
     * @param handler - The callback function
     *
     * @example
     * ```typescript
     * packs.onPackEvent('packAdded', ({ packId, info }) => {
     *   console.log(`Pack added: ${info.name}`);
     * });
     *
     * packs.onPackEvent('packsChanged', ({ reason }) => {
     *   rebuildScene();
     * });
     * ```
     */
    onPackEvent<T extends PackEventType>(event: T, handler: PackEventHandler<T>): void;
    /**
     * Unsubscribe from a pack event.
     *
     * @param event - The event type
     * @param handler - The callback function to remove
     */
    offPackEvent<T extends PackEventType>(event: T, handler: PackEventHandler<T>): void;
    /**
     * Subscribe to a pack event once (auto-removes after first trigger).
     *
     * @param event - The event type
     * @param handler - The callback function
     */
    oncePackEvent<T extends PackEventType>(event: T, handler: PackEventHandler<T>): void;
    /**
     * Begin batch update mode.
     * In batch mode, atlas rebuilds are deferred until endPackBatchUpdate() is called.
     *
     * @example
     * ```typescript
     * packs.beginPackBatchUpdate();
     * await packs.togglePack(pack1);
     * await packs.togglePack(pack2);
     * await packs.setPackPriority(pack3, 5);
     * await packs.endPackBatchUpdate(); // Single rebuild here
     * ```
     */
    beginPackBatchUpdate(): void;
    /**
     * End batch update mode and trigger rebuild if needed.
     */
    endPackBatchUpdate(): Promise<void>;
    /**
     * Enable or disable automatic atlas rebuilding.
     *
     * @param enabled - Whether to auto-rebuild
     */
    setPackAutoRebuild(enabled: boolean): void;
    /**
     * Manually trigger an atlas rebuild.
     */
    rebuildPackAtlas(): Promise<void>;
    /**
     * Save the current pack state to IndexedDB.
     * Note: State is automatically persisted, this is for explicit saves.
     */
    savePackState(): Promise<void>;
    /**
     * Load pack state from IndexedDB.
     *
     * @returns true if state was loaded, false if no saved state exists
     */
    loadPackState(): Promise<boolean>;
    /**
     * Export the current pack configuration for backup or sharing.
     *
     * @returns Configuration object that can be JSON serialized
     */
    exportPackConfig(): PackConfig;
    /**
     * Import a pack configuration.
     *
     * @param config - The configuration to import
     */
    importPackConfig(config: PackConfig): Promise<void>;
    /**
     * Check if a URL is cached.
     *
     * @param url - The URL to check
     */
    isPackCached(url: string): Promise<boolean>;
    /**
     * Get the total cache size in bytes.
     */
    getPackCacheSize(): Promise<number>;
    /**
     * Clear all cached pack downloads.
     */
    clearPackCache(): Promise<void>;
    /**
     * Get memory usage statistics.
     */
    getPackMemoryUsage(): PackMemoryUsage;
    /**
     * Validate a pack without loading it.
     *
     * @param blob - The pack blob to validate
     * @returns Validation result with errors, warnings, and detected metadata
     *
     * @example
     * ```typescript
     * const result = await packs.validatePack(file);
     * if (!result.valid) {
     *   console.error('Invalid pack:', result.errors);
     *   return;
     * }
     * if (result.warnings.length > 0) {
     *   console.warn('Warnings:', result.warnings);
     * }
     * // Safe to load
     * await packs.loadPackFromFile(file);
     * ```
     */
    validatePack(blob: Blob): Promise<PackValidationResult>;
    /**
     * Get the underlying ResourcePackManager instance.
     * Use this for advanced operations not exposed through the proxy.
     */
    get manager_(): ResourcePackManager;
}
//# sourceMappingURL=ResourcePackManagerProxy.d.ts.map