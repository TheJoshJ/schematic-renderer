// ResourcePackManagerProxy.ts - External API for resource pack management
// Provides a clean, user-facing API similar to Cubane's pack management
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
export class ResourcePackManagerProxy {
    constructor(manager) {
        Object.defineProperty(this, "manager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.manager = manager;
    }
    // ==================== Pack Loading ====================
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
    async loadPackFromUrl(url, options) {
        return this.manager.loadPackFromUrl(url, options);
    }
    /**
     * Load a resource pack from a Blob.
     *
     * @param blob - The blob containing the pack data
     * @param name - Optional display name for the pack
     * @returns Promise resolving to the pack ID
     */
    async loadPackFromBlob(blob, name) {
        return this.manager.loadPackFromBlob(blob, name);
    }
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
    async loadPackFromFile(file) {
        return this.manager.loadPackFromFile(file);
    }
    // ==================== Pack Management ====================
    /**
     * Remove a pack by ID.
     *
     * @param packId - The ID of the pack to remove
     */
    async removePack(packId) {
        return this.manager.removePack(packId);
    }
    /**
     * Remove all loaded packs.
     */
    async removeAllPacks() {
        return this.manager.removeAllPacks();
    }
    /**
     * Enable a pack (makes it active for rendering).
     *
     * @param packId - The ID of the pack to enable
     */
    async enablePack(packId) {
        return this.manager.enablePack(packId);
    }
    /**
     * Disable a pack (removes from rendering without unloading).
     *
     * @param packId - The ID of the pack to disable
     */
    async disablePack(packId) {
        return this.manager.disablePack(packId);
    }
    /**
     * Toggle a pack's enabled state.
     *
     * @param packId - The ID of the pack to toggle
     * @returns The new enabled state
     */
    async togglePack(packId) {
        return this.manager.togglePack(packId);
    }
    // ==================== Priority Management ====================
    /**
     * Set a pack's priority level.
     * Higher priority packs override lower priority packs for conflicting assets.
     *
     * @param packId - The ID of the pack
     * @param priority - The new priority level
     */
    async setPackPriority(packId, priority) {
        return this.manager.setPackPriority(packId, priority);
    }
    /**
     * Move a pack up in priority (increase priority).
     *
     * @param packId - The ID of the pack to move up
     */
    async movePackUp(packId) {
        return this.manager.movePackUp(packId);
    }
    /**
     * Move a pack down in priority (decrease priority).
     *
     * @param packId - The ID of the pack to move down
     */
    async movePackDown(packId) {
        return this.manager.movePackDown(packId);
    }
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
    async reorderPacks(packIds) {
        return this.manager.reorderPacks(packIds);
    }
    // ==================== Querying ====================
    /**
     * Get information about a specific pack.
     *
     * @param packId - The ID of the pack
     * @returns Pack info or null if not found
     */
    getPackInfo(packId) {
        return this.manager.getPackInfo(packId);
    }
    /**
     * Get all loaded packs, sorted by priority.
     *
     * @returns Array of pack information
     */
    getAllPacks() {
        return this.manager.getAllPacks();
    }
    /**
     * Get only enabled packs, sorted by priority.
     *
     * @returns Array of enabled pack information
     */
    getEnabledPacks() {
        return this.manager.getEnabledPacks();
    }
    /**
     * Get the total number of loaded packs.
     */
    getPackCount() {
        return this.manager.getPackCount();
    }
    /**
     * Get all assets in a specific pack.
     *
     * @param packId - The ID of the pack
     * @returns Object with arrays of texture, blockstate, and model paths
     */
    async getPackAssets(packId) {
        return this.manager.getPackAssets(packId);
    }
    /**
     * Find which pack provides a specific asset.
     *
     * @param path - The asset path (e.g., 'block/stone')
     * @param type - The type of asset
     * @returns Pack ID of the provider, or null if not found
     */
    async getAssetSource(path, type) {
        return this.manager.getAssetSource(path, type);
    }
    /**
     * Get all asset conflicts between enabled packs.
     *
     * @returns Array of conflict information
     */
    async getAssetConflicts() {
        return this.manager.getAssetConflicts();
    }
    /**
     * Get a preview data URL for a texture from a specific pack.
     *
     * @param packId - The ID of the pack
     * @param texturePath - The texture path (e.g., 'block/stone')
     * @returns Data URL of the texture, or null if not found
     */
    async previewPackTexture(packId, texturePath) {
        return this.manager.previewPackTexture(packId, texturePath);
    }
    // ==================== Events ====================
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
    onPackEvent(event, handler) {
        this.manager.onPackEvent(event, handler);
    }
    /**
     * Unsubscribe from a pack event.
     *
     * @param event - The event type
     * @param handler - The callback function to remove
     */
    offPackEvent(event, handler) {
        this.manager.offPackEvent(event, handler);
    }
    /**
     * Subscribe to a pack event once (auto-removes after first trigger).
     *
     * @param event - The event type
     * @param handler - The callback function
     */
    oncePackEvent(event, handler) {
        this.manager.oncePackEvent(event, handler);
    }
    // ==================== Batch Operations ====================
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
    beginPackBatchUpdate() {
        this.manager.beginPackBatchUpdate();
    }
    /**
     * End batch update mode and trigger rebuild if needed.
     */
    async endPackBatchUpdate() {
        return this.manager.endPackBatchUpdate();
    }
    /**
     * Enable or disable automatic atlas rebuilding.
     *
     * @param enabled - Whether to auto-rebuild
     */
    setPackAutoRebuild(enabled) {
        this.manager.setPackAutoRebuild(enabled);
    }
    /**
     * Manually trigger an atlas rebuild.
     */
    async rebuildPackAtlas() {
        return this.manager.rebuildPackAtlas();
    }
    // ==================== Persistence ====================
    /**
     * Save the current pack state to IndexedDB.
     * Note: State is automatically persisted, this is for explicit saves.
     */
    async savePackState() {
        return this.manager.savePackState();
    }
    /**
     * Load pack state from IndexedDB.
     *
     * @returns true if state was loaded, false if no saved state exists
     */
    async loadPackState() {
        return this.manager.loadPackState();
    }
    /**
     * Export the current pack configuration for backup or sharing.
     *
     * @returns Configuration object that can be JSON serialized
     */
    exportPackConfig() {
        return this.manager.exportPackConfig();
    }
    /**
     * Import a pack configuration.
     *
     * @param config - The configuration to import
     */
    async importPackConfig(config) {
        return this.manager.importPackConfig(config);
    }
    // ==================== Cache Management ====================
    /**
     * Check if a URL is cached.
     *
     * @param url - The URL to check
     */
    async isPackCached(url) {
        return this.manager.isPackCached(url);
    }
    /**
     * Get the total cache size in bytes.
     */
    async getPackCacheSize() {
        return this.manager.getPackCacheSize();
    }
    /**
     * Clear all cached pack downloads.
     */
    async clearPackCache() {
        return this.manager.clearPackCache();
    }
    /**
     * Get memory usage statistics.
     */
    getPackMemoryUsage() {
        return this.manager.getPackMemoryUsage();
    }
    // ==================== Validation ====================
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
    async validatePack(blob) {
        return this.manager.validatePack(blob);
    }
    // ==================== Direct Manager Access ====================
    /**
     * Get the underlying ResourcePackManager instance.
     * Use this for advanced operations not exposed through the proxy.
     */
    get manager_() {
        return this.manager;
    }
}
