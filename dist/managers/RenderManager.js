// managers/RenderManager.ts
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// Dynamic imports for post-processing (loaded on-demand)
let EffectComposer = null;
let RenderPass = null;
let EffectPass = null;
let SMAAEffect = null;
let N8AOPostPass = null;
let GammaCorrectionEffect = null;
let postprocessingLoaded = false;
async function loadPostProcessing() {
    if (postprocessingLoaded)
        return;
    console.log("[RenderManager] Lazy-loading post-processing effects...");
    const postprocessing = await import("postprocessing");
    // @ts-ignore - n8ao doesn't have TypeScript definitions
    const n8ao = await import("n8ao");
    const gammaEffect = await import("../effects/GammaCorrectionEffect");
    EffectComposer = postprocessing.EffectComposer;
    RenderPass = postprocessing.RenderPass;
    EffectPass = postprocessing.EffectPass;
    SMAAEffect = postprocessing.SMAAEffect;
    N8AOPostPass = n8ao.N8AOPostPass;
    GammaCorrectionEffect = gammaEffect.GammaCorrectionEffect;
    postprocessingLoaded = true;
    console.log("[RenderManager] Post-processing effects loaded");
}
// HDRI Cache using IndexedDB
const HDRI_CACHE_DB_NAME = "schematic-renderer-hdri-cache";
const HDRI_CACHE_STORE_NAME = "hdri-textures";
const HDRI_CACHE_VERSION = 1;
let hdriCacheDb = null;
async function openHdriCacheDb() {
    if (hdriCacheDb)
        return hdriCacheDb;
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(HDRI_CACHE_DB_NAME, HDRI_CACHE_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            hdriCacheDb = request.result;
            resolve(hdriCacheDb);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(HDRI_CACHE_STORE_NAME)) {
                db.createObjectStore(HDRI_CACHE_STORE_NAME, { keyPath: "url" });
            }
        };
    });
}
async function getCachedHdri(url) {
    try {
        const db = await openHdriCacheDb();
        return new Promise((resolve) => {
            const transaction = db.transaction(HDRI_CACHE_STORE_NAME, "readonly");
            const store = transaction.objectStore(HDRI_CACHE_STORE_NAME);
            const request = store.get(url);
            request.onsuccess = () => {
                if (request.result) {
                    console.log(`[HDRI Cache] Cache hit for: ${url}`);
                    resolve(request.result.data);
                }
                else {
                    resolve(null);
                }
            };
            request.onerror = () => resolve(null);
        });
    }
    catch {
        return null;
    }
}
async function cacheHdri(url, data) {
    try {
        const db = await openHdriCacheDb();
        return new Promise((resolve) => {
            const transaction = db.transaction(HDRI_CACHE_STORE_NAME, "readwrite");
            const store = transaction.objectStore(HDRI_CACHE_STORE_NAME);
            store.put({ url, data, timestamp: Date.now() });
            transaction.oncomplete = () => {
                console.log(`[HDRI Cache] Cached: ${url}`);
                resolve();
            };
            transaction.onerror = () => resolve();
        });
    }
    catch {
        // Ignore cache errors
    }
}
// WebGPU imports (conditional - loaded dynamically)
let WebGPURenderer = null;
// @ts-expect-error Reserved for future WebGPU post-processing support
let _PostProcessing = null;
let Inspector = null;
export class RenderManager {
    constructor(schematicRenderer) {
        Object.defineProperty(this, "schematicRenderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "composer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // EffectComposer type (loaded dynamically)
        // @ts-expect-error Reserved for future WebGPU post-processing support
        Object.defineProperty(this, "_postProcessing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "passes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "eventEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pmremGenerator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isRendering", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "hdriPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "hdriBackgroundOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "currentEnvMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "disposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "contextLost", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "initialSizeSet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "resizeTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "renderRequested", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // WebGPU state
        Object.defineProperty(this, "_isWebGPU", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // @ts-expect-error Reserved for future use
        Object.defineProperty(this, "_webgpuInitialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "inspector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // HDRI backup for camera switching
        Object.defineProperty(this, "originalBackground", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isometricBackground", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // SSAO presets for different camera modes
        Object.defineProperty(this, "ssaoPresets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                perspective: {
                    aoRadius: 1.0,
                    distanceFalloff: 0.4,
                    intensity: 5.0,
                },
                isometric: {
                    aoRadius: 0.3,
                    distanceFalloff: 0.1,
                    intensity: 0.8,
                },
            }
        });
        Object.defineProperty(this, "handleContextLost", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (event) => {
                event.preventDefault();
                this.contextLost = true;
                this.isRendering = false;
                console.log("WebGL context lost. Suspending render operations...");
                this.eventEmitter.emit("webglContextLost");
            }
        });
        Object.defineProperty(this, "handleContextRestored", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                console.log("WebGL context restored. Reinitializing renderer...");
                try {
                    await new Promise((resolve) => setTimeout(resolve, 300));
                    this.contextLost = false;
                    await this.initWebGLRenderer();
                    this.updateCanvasSize();
                    if (this.hdriPath) {
                        await new Promise((resolve) => setTimeout(resolve, 100));
                        this.loadHDRI(this.hdriPath, this.hdriBackgroundOnly);
                    }
                    this.eventEmitter.emit("webglContextRestored");
                    requestAnimationFrame(() => {
                        if (!this.contextLost) {
                            this.render();
                        }
                    });
                }
                catch (error) {
                    console.error("Error during context restoration:", error);
                    this.eventEmitter.emit("webglContextError", { error });
                }
            }
        });
        this.schematicRenderer = schematicRenderer;
        this.eventEmitter = this.schematicRenderer.eventEmitter;
        // Create a pleasant background color for isometric view
        this.isometricBackground = new THREE.Color(0x87ceeb); // Sky blue
        // Apply custom SSAO presets from options if provided
        const customSSAOPresets = schematicRenderer.options?.postProcessingOptions?.ssaoPresets;
        if (customSSAOPresets) {
            if (customSSAOPresets.perspective) {
                this.ssaoPresets.perspective = {
                    ...this.ssaoPresets.perspective,
                    ...customSSAOPresets.perspective,
                };
            }
            if (customSSAOPresets.isometric) {
                this.ssaoPresets.isometric = {
                    ...this.ssaoPresets.isometric,
                    ...customSSAOPresets.isometric,
                };
            }
        }
        this.setInitialSize();
    }
    /**
     * Async initialization - must be called after constructor
     */
    async initialize() {
        const webgpuOptions = this.schematicRenderer.options.webgpuOptions;
        const preferWebGPU = webgpuOptions?.preferWebGPU ?? false;
        const forceWebGPU = webgpuOptions?.forceWebGPU ?? false;
        if (preferWebGPU || forceWebGPU) {
            const webgpuAvailable = await this.checkWebGPUSupport();
            if (webgpuAvailable || forceWebGPU) {
                try {
                    await this.initWebGPURenderer();
                    this._isWebGPU = true;
                    console.log("%c[RenderManager] WebGPU Renderer initialized", "color: #4caf50; font-weight: bold");
                }
                catch (error) {
                    console.warn("[RenderManager] WebGPU initialization failed, falling back to WebGL:", error);
                    await this.initWebGLRenderer();
                }
            }
            else {
                console.log("[RenderManager] WebGPU not available, using WebGL");
                await this.initWebGLRenderer();
            }
        }
        else {
            await this.initWebGLRenderer();
        }
        this.setupEventListeners();
        this.updateCanvasSize();
        // HDRI loading uses ShaderMaterials internally (PMREMGenerator, WebGLCubeRenderTarget)
        // which are not compatible with WebGPU's node-based material system.
        // Skip HDRI in WebGPU mode and use a solid color background.
        if (this.schematicRenderer.options?.hdri !== undefined &&
            this.schematicRenderer.options.hdri !== "") {
            if (this._isWebGPU) {
                console.warn("[RenderManager] HDRI backgrounds are not yet supported in WebGPU mode. Using solid color with enhanced lighting.");
                // Set a nice sky color
                this.schematicRenderer.sceneManager.scene.background = new THREE.Color(0x87ceeb);
                // Create a simple procedural environment for PBR materials
                // This provides basic ambient lighting for MeshStandardMaterial
                this.setupWebGPUEnvironment();
            }
            else {
                this.setupHDRIBackground(this.schematicRenderer.options.hdri);
            }
        }
        // Listen for camera changes to handle HDRI switching
        this.schematicRenderer.cameraManager.on("cameraChanged", (event) => {
            this.handleCameraChange(event.newCamera);
        });
    }
    /**
     * Check if WebGPU is supported in the current browser
     */
    async checkWebGPUSupport() {
        if (!navigator.gpu) {
            return false;
        }
        try {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                return false;
            }
            // Try to get a device to verify full support
            const device = await adapter.requestDevice();
            device.destroy();
            return true;
        }
        catch (error) {
            console.warn("[RenderManager] WebGPU check failed:", error);
            return false;
        }
    }
    /**
     * Check if currently using WebGPU renderer
     */
    get isWebGPU() {
        return this._isWebGPU;
    }
    /**
     * Get the Three.js Inspector (WebGPU only)
     */
    getInspector() {
        return this.inspector;
    }
    /**
     * Setup simple environment lighting for WebGPU mode
     * Since HDRI/PMREMGenerator isn't compatible with WebGPU, we enhance
     * the scene lighting to compensate for the lack of environment maps.
     */
    setupWebGPUEnvironment() {
        const scene = this.schematicRenderer.sceneManager.scene;
        const sceneManager = this.schematicRenderer.sceneManager;
        // Boost existing lights to compensate for no environment map
        // SceneManager stores lights in a Map, access via getLight if available
        if (sceneManager.lights) {
            const lights = sceneManager.lights;
            const ambientLight = lights.get("ambientLight");
            if (ambientLight) {
                ambientLight.intensity = 3.5; // Boost ambient significantly
            }
            const directionalLight = lights.get("directionalLight");
            if (directionalLight) {
                directionalLight.intensity = 1.5; // Boost directional
            }
        }
        // Add a hemisphere light for better sky/ground lighting
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, // Sky color (light blue)
        0x666666, // Ground color (medium gray for better contrast)
        2.0 // Higher intensity
        );
        hemiLight.name = "webgpuHemiLight";
        scene.add(hemiLight);
        // Add a fill light from the opposite direction for better shading
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
        fillLight.position.set(-15, 15, 15);
        fillLight.name = "webgpuFillLight";
        scene.add(fillLight);
        // Add a back light for rim lighting effect
        const backLight = new THREE.DirectionalLight(0xffffcc, 0.4);
        backLight.position.set(0, -10, -20);
        backLight.name = "webgpuBackLight";
        scene.add(backLight);
        console.log("[RenderManager] WebGPU environment lighting configured");
    }
    setInitialSize() {
        const canvas = this.schematicRenderer.canvas;
        const parent = canvas.parentElement;
        if (!parent) {
            console.warn("Canvas parent element not found");
            return;
        }
        const rect = parent.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        this.initialSizeSet = true;
    }
    /**
     * Initialize WebGPU Renderer
     */
    async initWebGPURenderer() {
        // Dynamically import WebGPU modules
        const webgpuModule = await import("three/webgpu");
        WebGPURenderer = webgpuModule.WebGPURenderer;
        _PostProcessing = webgpuModule.PostProcessing;
        // Try to import Inspector (no types available yet)
        try {
            // @ts-expect-error Inspector module doesn't have type definitions yet
            const inspectorModule = await import("three/examples/jsm/inspector/Inspector.js");
            Inspector = inspectorModule.Inspector;
        }
        catch (e) {
            console.warn("[RenderManager] Three.js Inspector not available:", e);
        }
        this.renderer = new WebGPURenderer({
            canvas: this.schematicRenderer.canvas,
            antialias: true,
            powerPreference: "high-performance",
        });
        // WebGPU requires async initialization
        await this.renderer.init();
        if (this.initialSizeSet) {
            const parent = this.schematicRenderer.canvas.parentElement;
            if (parent) {
                const width = parent.clientWidth;
                const height = parent.clientHeight;
                this.renderer.setSize(width, height, false);
            }
        }
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // Initialize Inspector if available
        if (Inspector && this.schematicRenderer.options.debugOptions?.enableInspector) {
            try {
                this.inspector = new Inspector();
                this.inspector.setRenderer(this.renderer);
                console.log("[RenderManager] Three.js Inspector initialized");
            }
            catch (e) {
                console.warn("[RenderManager] Failed to initialize Inspector:", e);
            }
        }
        // WebGPU uses different post-processing
        // For now, we'll skip the complex post-processing and use basic rendering
        // The postprocessing library doesn't support WebGPU yet
        this.composer = null;
        this._webgpuInitialized = true;
        this.renderer.resetState();
        // Create PMREMGenerator for HDRI
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    }
    /**
     * Initialize WebGL Renderer (original code)
     */
    async initWebGLRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.schematicRenderer.canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
        });
        if (this.initialSizeSet) {
            const parent = this.schematicRenderer.canvas.parentElement;
            if (parent) {
                const width = parent.clientWidth;
                const height = parent.clientHeight;
                this.renderer.setSize(width, height, false);
            }
        }
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // this.renderer.resetState();
        await this.initComposer();
        this.initDefaultPasses(this.schematicRenderer.options);
    }
    async initComposer() {
        if (this._isWebGPU)
            return; // WebGPU uses different post-processing
        const postOpts = this.schematicRenderer.options.postProcessingOptions;
        // If master switch disabled, don't create composer
        if (postOpts && postOpts.enabled === false)
            return;
        // If all individual effects disabled, don't create composer
        if (postOpts &&
            postOpts.enableSSAO === false &&
            postOpts.enableSMAA === false &&
            postOpts.enableGamma === false) {
            return;
        }
        // Lazy-load post-processing modules only when needed
        await loadPostProcessing();
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.schematicRenderer.sceneManager.scene, this.schematicRenderer.cameraManager.activeCamera.camera);
        this.composer.addPass(renderPass);
        this.passes.set("renderPass", renderPass);
    }
    /**
     * Handle camera type changes to manage HDRI background and SSAO appropriately
     */
    handleCameraChange(cameraType) {
        const scene = this.schematicRenderer.sceneManager.scene;
        if (cameraType === "isometric") {
            // Store the current background if it's HDRI
            if (scene.background && scene.background instanceof THREE.Texture) {
                this.originalBackground = scene.background;
            }
            // Switch to solid color background for isometric view
            scene.background = this.isometricBackground;
            // Adjust SSAO for isometric view (orthographic cameras have different depth)
            this.setSSAOParameters(this.ssaoPresets.isometric);
            console.log("Switched to isometric mode (background + SSAO adjusted)");
        }
        else {
            // Restore HDRI background for perspective cameras
            if (this.originalBackground) {
                scene.background = this.originalBackground;
                console.log("Restored HDRI background");
            }
            // Restore perspective SSAO settings
            this.setSSAOParameters(this.ssaoPresets.perspective);
            console.log("Switched to perspective mode (SSAO restored)");
        }
    }
    /**
     * Check if current camera is orthographic (isometric)
     */
    isOrthographicCamera() {
        const activeCamera = this.schematicRenderer.cameraManager.activeCamera.camera;
        return activeCamera instanceof THREE.OrthographicCamera;
    }
    setupHDRIBackground(hdriPath, backgroundOnly = true) {
        this.hdriPath = hdriPath;
        this.hdriBackgroundOnly = backgroundOnly;
        this.loadHDRI(hdriPath, backgroundOnly);
        const canvas = this.renderer.domElement;
        canvas.removeEventListener("webglcontextlost", this.handleContextLost);
        canvas.removeEventListener("webglcontextrestored", this.handleContextRestored);
        // Only add context lost handlers for WebGL
        if (!this._isWebGPU) {
            canvas.addEventListener("webglcontextlost", this.handleContextLost, false);
            canvas.addEventListener("webglcontextrestored", this.handleContextRestored, false);
        }
    }
    isPMREMGeneratorDisposed() {
        return !this.pmremGenerator || this.pmremGenerator._blurMaterial === null;
    }
    loadHDRI(hdriPath, backgroundOnly) {
        // Try to load from cache first
        this.loadHDRIWithCache(hdriPath, backgroundOnly);
    }
    async loadHDRIWithCache(hdriPath, backgroundOnly) {
        const hdriLoader = new RGBELoader();
        hdriLoader.setDataType(THREE.HalfFloatType);
        // Check cache first
        const cachedData = await getCachedHdri(hdriPath);
        if (cachedData) {
            // Load from cached ArrayBuffer
            try {
                const parseResult = hdriLoader.parse(cachedData);
                // Cast to DataTexture since parse returns RGBE type but actually gives us a texture
                const texture = parseResult;
                // Ensure texture has required properties for PMREMGenerator
                if (texture && texture.image && texture.image.width && texture.image.height) {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    this.applyHDRITexture(texture, backgroundOnly, hdriPath);
                    return;
                }
                else {
                    console.warn("[HDRI Cache] Cached texture missing required properties, fetching fresh");
                }
            }
            catch (error) {
                console.warn("[HDRI Cache] Failed to parse cached data, fetching fresh:", error);
            }
        }
        // Fetch and cache using the standard load method which properly sets all texture properties
        hdriLoader.load(hdriPath, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.applyHDRITexture(texture, backgroundOnly, hdriPath);
            // Cache the raw data for next time by re-fetching (load doesn't expose ArrayBuffer)
            fetch(hdriPath)
                .then((response) => response.arrayBuffer())
                .then((arrayBuffer) => cacheHdri(hdriPath, arrayBuffer))
                .catch(() => {
                /* Ignore cache errors */
            });
        }, undefined, (error) => {
            console.error("HDRI loading failed:", error);
            this.eventEmitter.emit("hdriError", { error });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyHDRITexture(texture, backgroundOnly, hdriPath) {
        if (this.disposed) {
            texture.dispose();
            return;
        }
        if (this.isPMREMGeneratorDisposed()) {
            this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        }
        const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;
        this.currentEnvMap = envMap;
        if (backgroundOnly) {
            const backgroundTexture = new THREE.WebGLCubeRenderTarget(1024).fromEquirectangularTexture(this.renderer, texture);
            // Only set HDRI background if not in isometric mode
            if (!this.isOrthographicCamera()) {
                this.schematicRenderer.sceneManager.scene.background = backgroundTexture.texture;
                // Store as original background for camera switching
                this.originalBackground = backgroundTexture.texture;
            }
            else {
                // Store for later use when switching back to perspective
                this.originalBackground = backgroundTexture.texture;
                // Keep isometric background
                this.schematicRenderer.sceneManager.scene.background = this.isometricBackground;
            }
        }
        else {
            this.schematicRenderer.sceneManager.scene.environment = envMap;
            if (!this.isOrthographicCamera()) {
                this.schematicRenderer.sceneManager.scene.background = envMap;
                this.originalBackground = envMap;
            }
            else {
                this.originalBackground = envMap;
                this.schematicRenderer.sceneManager.scene.background = this.isometricBackground;
            }
        }
        texture.dispose();
        this.pmremGenerator.dispose();
        this.eventEmitter.emit("hdriLoaded", { path: hdriPath });
    }
    /**
     * Set the background color for isometric view
     */
    setIsometricBackgroundColor(color) {
        this.isometricBackground.set(color);
        // If currently in isometric mode, update the scene background immediately
        if (this.isOrthographicCamera()) {
            this.schematicRenderer.sceneManager.scene.background = this.isometricBackground;
        }
    }
    /**
     * Get the current isometric background color
     */
    getIsometricBackgroundColor() {
        return this.isometricBackground.clone();
    }
    initDefaultPasses(options) {
        if (this._isWebGPU || !this.composer)
            return;
        const postOpts = this.schematicRenderer.options.postProcessingOptions;
        const effects = [];
        if (postOpts?.enableGamma !== false) {
            const gammaCorrectionEffect = new GammaCorrectionEffect(options.gamma ?? 0.5);
            this.passes.set("gammaCorrection", gammaCorrectionEffect);
            effects.push(gammaCorrectionEffect);
        }
        if (postOpts?.enableSMAA !== false) {
            const smaaEffect = new SMAAEffect();
            this.passes.set("smaa", smaaEffect);
            effects.push(smaaEffect);
        }
        if (postOpts?.enableSSAO !== false) {
            try {
                const parent = this.schematicRenderer.canvas.parentElement;
                const width = parent ? parent.clientWidth : window.innerWidth;
                const height = parent ? parent.clientHeight : window.innerHeight;
                const n8aoPass = new N8AOPostPass(this.schematicRenderer.sceneManager.scene, this.schematicRenderer.cameraManager.activeCamera.camera, width, height);
                n8aoPass.configuration.aoRadius = 1.0;
                n8aoPass.configuration.distanceFalloff = 0.4;
                n8aoPass.configuration.intensity = 5.0;
                n8aoPass.configuration.gammaCorrection = false;
                n8aoPass.setQualityMode("Medium");
                this.passes.set("ssao", n8aoPass);
                this.composer.addPass(n8aoPass);
                console.log("N8AO SSAO enabled successfully");
            }
            catch (error) {
                console.warn("Failed to initialize N8AO SSAO:", error);
            }
        }
        if (effects.length > 0) {
            const effectPass = new EffectPass(this.schematicRenderer.cameraManager.activeCamera.camera, ...effects);
            effectPass.renderToScreen = true;
            this.composer.addPass(effectPass);
            this.passes.set("effectPass", effectPass);
        }
        else if (this.composer.passes.length > 1) {
            // If we have other passes (like SSAO) but no effect pass, make sure the last pass renders to screen
            // N8AO pass usually renders to screen if it's the last one?
            // N8AO might need renderToScreen set manually if it's the final pass
            const lastPass = this.composer.passes[this.composer.passes.length - 1];
            if (lastPass) {
                lastPass.renderToScreen = true;
            }
        }
        else {
            // If we have composer but no effects added (edge case), better to just disable composer
            this.composer = null;
        }
    }
    setupEventListeners() {
        window.addEventListener("resize", () => {
            if (this.resizeTimeout) {
                window.cancelAnimationFrame(this.resizeTimeout);
            }
            this.resizeTimeout = window.requestAnimationFrame(() => {
                this.updateCanvasSize();
                this.resizeTimeout = null;
            });
        });
    }
    updateCanvasSize() {
        const canvas = this.schematicRenderer.canvas;
        const parent = canvas.parentElement;
        if (!parent)
            return;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        if (!this.contextLost) {
            this.renderer.setSize(width, height, false);
            if (this.composer) {
                this.composer.setSize(width, height);
            }
            const camera = this.schematicRenderer.cameraManager.activeCamera
                .camera;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            const ssaoPass = this.passes.get("ssao");
            if (ssaoPass && ssaoPass.setSize) {
                const dpr = this.renderer.getPixelRatio();
                ssaoPass.setSize(width * dpr, height * dpr);
            }
        }
    }
    enableEffect(effectName) {
        const effect = this.passes.get(effectName);
        if (effect) {
            effect.enabled = true;
        }
    }
    disableEffect(effectName) {
        const effect = this.passes.get(effectName);
        if (effect) {
            effect.enabled = false;
        }
    }
    setGamma(value) {
        const gammaEffect = this.passes.get("gammaCorrection");
        if (gammaEffect) {
            gammaEffect.setGamma(value);
        }
    }
    /**
     * Enable or disable SSAO at runtime
     * Useful for auto-disabling on small schematics or performance optimization
     */
    setSSAOEnabled(enabled) {
        const ssaoPass = this.passes.get("ssao");
        if (ssaoPass) {
            ssaoPass.enabled = enabled;
            if (!enabled) {
                console.log("[RenderManager] SSAO disabled for performance");
            }
        }
    }
    /**
     * Check if SSAO is currently enabled
     */
    isSSAOEnabled() {
        const ssaoPass = this.passes.get("ssao");
        return ssaoPass?.enabled ?? false;
    }
    setSSAOParameters(params) {
        const ssaoEffect = this.passes.get("ssao");
        if (ssaoEffect && ssaoEffect.configuration) {
            if (params.aoRadius !== undefined) {
                ssaoEffect.configuration.aoRadius = params.aoRadius;
            }
            if (params.distanceFalloff !== undefined) {
                ssaoEffect.configuration.distanceFalloff = params.distanceFalloff;
            }
            if (params.intensity !== undefined) {
                ssaoEffect.configuration.intensity = params.intensity;
            }
            if (params.qualityMode !== undefined) {
                ssaoEffect.setQualityMode(params.qualityMode);
            }
        }
    }
    /**
     * Customize SSAO presets for different camera modes
     * @param mode - Camera mode ('perspective' or 'isometric')
     * @param params - SSAO parameters to apply for this mode
     */
    setSSAOPreset(mode, params) {
        this.ssaoPresets[mode] = {
            ...this.ssaoPresets[mode],
            ...params,
        };
        // If we're currently in this mode, apply the changes immediately
        const currentCameraType = this.isOrthographicCamera() ? "isometric" : "perspective";
        if (currentCameraType === mode) {
            this.setSSAOParameters(this.ssaoPresets[mode]);
        }
        console.log(`SSAO preset updated for ${mode} mode:`, this.ssaoPresets[mode]);
    }
    /**
     * Get current SSAO presets
     */
    getSSAOPresets() {
        return {
            perspective: { ...this.ssaoPresets.perspective },
            isometric: { ...this.ssaoPresets.isometric },
        };
    }
    renderSingleFrameAndGetStats() {
        if (this.isRendering || this.contextLost || this.disposed) {
            console.warn("[RenderManager] Attempted renderSingleFrameAndGetStats while busy, context lost, or disposed.");
            return { renderTimeMs: 0, rendererInfo: null };
        }
        const scene = this.schematicRenderer.sceneManager.scene;
        const camera = this.schematicRenderer.cameraManager.activeCamera.camera;
        const renderer = this.renderer;
        if (!renderer || !scene || !camera) {
            console.error("[RenderManager] Renderer, scene, or camera not available for renderSingleFrameAndGetStats.");
            return { renderTimeMs: 0, rendererInfo: renderer ? renderer.info : null };
        }
        // Skip context check for WebGPU
        if (!this._isWebGPU) {
            const gl = renderer.getContext();
            if (!gl || gl.isContextLost()) {
                console.warn("[RenderManager] Attempted to render with lost WebGL context for stats.");
                this.contextLost = true;
                return { renderTimeMs: 0, rendererInfo: renderer.info };
            }
        }
        const renderStartTime = performance.now();
        try {
            this.isRendering = true;
            if (this._isWebGPU) {
                // WebGPU direct rendering
                this.renderer.render(scene, camera);
            }
            else if (this.composer) {
                this.composer.render();
            }
            else {
                this.renderer.render(scene, camera);
            }
        }
        catch (error) {
            console.error("[RenderManager] Error during renderSingleFrameAndGetStats:", error);
            this.eventEmitter.emit("renderError", { error });
            return {
                renderTimeMs: performance.now() - renderStartTime,
                rendererInfo: renderer.info,
            };
        }
        finally {
            this.isRendering = false;
        }
        const renderTimeMs = performance.now() - renderStartTime;
        return { renderTimeMs, rendererInfo: renderer.info };
    }
    render() {
        if (this.isRendering || this.contextLost || this.disposed)
            return;
        try {
            this.isRendering = true;
            // Skip context check for WebGPU
            if (!this._isWebGPU) {
                const gl = this.renderer.getContext();
                if (!gl || gl.isContextLost()) {
                    console.warn("Attempted to render with lost WebGL context");
                    this.contextLost = true;
                    return;
                }
            }
            if (this._isWebGPU) {
                // WebGPU rendering
                const scene = this.schematicRenderer.sceneManager.scene;
                const camera = this.schematicRenderer.cameraManager.activeCamera.camera;
                this.renderer.render(scene, camera);
                // Resolve timestamp queries to prevent overflow (for Inspector)
                if (this.renderer.resolveTimestampsAsync) {
                    this.renderer.resolveTimestampsAsync("render").catch(() => {
                        // Silently ignore - timestamps are optional for profiling
                    });
                }
            }
            else if (this.composer) {
                this.composer.render();
            }
            else {
                // Fallback for WebGL without composer (post-processing disabled)
                this.renderer.render(this.schematicRenderer.sceneManager.scene, this.schematicRenderer.cameraManager.activeCamera.camera);
            }
            // if (!this._isWebGPU) {
            // 	this.renderer.resetState();
            // }
        }
        catch (error) {
            console.error("Render error:", error);
            this.eventEmitter.emit("renderError", { error });
        }
        finally {
            this.isRendering = false;
        }
    }
    requestRender() {
        if (!this.renderRequested && !this.contextLost && !this.disposed) {
            this.renderRequested = true;
            requestAnimationFrame(() => {
                if (!this.contextLost && !this.disposed) {
                    this.render();
                }
                this.renderRequested = false;
            });
        }
    }
    resize(width, height) {
        if (this.contextLost)
            return;
        this.renderer.setSize(width, height, false);
        if (this.composer) {
            this.composer.setSize(width, height);
        }
        const camera = this.schematicRenderer.cameraManager.activeCamera
            .camera;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const ssaoPass = this.passes.get("ssao");
        if (ssaoPass && ssaoPass.setSize) {
            ssaoPass.setSize(width, height);
        }
    }
    updateCamera(camera) {
        const renderPass = this.passes.get("renderPass");
        if (renderPass) {
            renderPass.camera = camera;
        }
        const effectPass = this.passes.get("effectPass");
        if (effectPass) {
            effectPass.camera = camera;
        }
        const ssaoEffect = this.passes.get("ssao");
        if (ssaoEffect && ssaoEffect.camera) {
            ssaoEffect.camera = camera;
        }
    }
    getRenderer() {
        return this.renderer;
    }
    getEffect(effectName) {
        return this.passes.get(effectName);
    }
    dispose() {
        this.disposed = true;
        this.contextLost = true;
        if (this.resizeTimeout !== null) {
            window.cancelAnimationFrame(this.resizeTimeout);
            this.resizeTimeout = null;
        }
        window.removeEventListener("resize", this.updateCanvasSize);
        const canvas = this.renderer.domElement;
        canvas.removeEventListener("webglcontextlost", this.handleContextLost);
        canvas.removeEventListener("webglcontextrestored", this.handleContextRestored);
        this.passes.forEach((pass) => {
            if (pass.dispose)
                pass.dispose();
        });
        this.passes.clear();
        if (this.composer) {
            this.composer.dispose();
        }
        if (this.pmremGenerator && !this.isPMREMGeneratorDisposed()) {
            this.pmremGenerator.dispose();
        }
        if (this.currentEnvMap) {
            this.currentEnvMap.dispose();
        }
        if (this.inspector) {
            // Inspector cleanup if needed
            this.inspector = null;
        }
        this.renderer.dispose();
    }
}
