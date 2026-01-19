import { SchematicRenderer } from "../SchematicRenderer";
export interface RecordingOptions {
    width?: number;
    height?: number;
    frameRate?: number;
    quality?: number;
    /** Use JPEG for intermediate frames (faster, smaller) vs PNG (lossless) */
    useJpegFrames?: boolean;
    /** JPEG quality for intermediate frames (0.8-0.95 recommended) */
    jpegQuality?: number;
    /** Batch size for writing frames to FFmpeg (higher = more memory, faster) */
    batchSize?: number;
    /** FFmpeg encoding preset: ultrafast, superfast, veryfast, faster, fast, medium */
    encodingPreset?: "ultrafast" | "superfast" | "veryfast" | "faster" | "fast" | "medium";
    /** CRF value for encoding quality (18-28, lower = better quality, larger file) */
    crf?: number;
    onStart?: () => void;
    onProgress?: (progress: number) => void;
    onFfmpegProgress?: (progress: number, time: number) => void;
    onComplete?: (blob: Blob) => void;
}
export interface ScreenshotOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: "image/png" | "image/jpeg";
}
export declare class RecordingManager {
    isRecording: boolean;
    private schematicRenderer;
    private recordingCanvas;
    private ctx2d;
    private ffmpeg?;
    private frameCount;
    private originalSettings;
    private frameBuffer;
    private pendingWrites;
    private useJpegFrames;
    private jpegQuality;
    constructor(schematicRenderer: SchematicRenderer);
    /**
     * Capture a frame optimized for video recording
     * Uses JPEG by default for much faster encoding (3-5x faster than PNG)
     */
    private captureFrame;
    /**
     * Capture frame for PNG screenshots (lossless)
     */
    private captureFramePNG;
    setCameraToFirstPathPoint(): void;
    /**
     * Takes a screenshot of the current view
     */
    takeScreenshot(options?: ScreenshotOptions): Promise<Blob>;
    private setupTemporarySettings;
    private restoreSettings;
    private setupRecording;
    /**
     * Write frames to FFmpeg in batches for better performance
     */
    private flushFrameBuffer;
    startRecording(duration: number, options?: RecordingOptions): Promise<void>;
    /**
     * Cleanup frames asynchronously in background
     */
    private cleanupFramesAsync;
    private cleanup;
    stopRecording(): void;
    dispose(): void;
}
//# sourceMappingURL=RecordingManager.d.ts.map