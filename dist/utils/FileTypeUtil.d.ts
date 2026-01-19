/**
 * Enum representing the different file types that can be handled by the application
 */
export declare enum FileType {
    SCHEMATIC = "schematic",
    RESOURCE_PACK = "resourcePack",
    UNKNOWN = "unknown"
}
export declare class FileTypeUtility {
    private static readonly SCHEMATIC_EXTENSIONS;
    private static readonly RESOURCE_PACK_EXTENSIONS;
    static determineFileType(file: File): FileType;
    private static getFileExtension;
    static isSchematic(file: File): boolean;
    static isResourcePack(file: File): boolean;
    static validateResourcePack(file: File): Promise<boolean>;
}
//# sourceMappingURL=FileTypeUtil.d.ts.map