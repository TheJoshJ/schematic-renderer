// FileTypeUtility.ts
/**
 * Enum representing the different file types that can be handled by the application
 */
export var FileType;
(function (FileType) {
    FileType["SCHEMATIC"] = "schematic";
    FileType["RESOURCE_PACK"] = "resourcePack";
    FileType["UNKNOWN"] = "unknown";
})(FileType || (FileType = {}));
export class FileTypeUtility {
    static determineFileType(file) {
        const extension = this.getFileExtension(file.name).toLowerCase();
        if (this.SCHEMATIC_EXTENSIONS.includes(extension)) {
            return FileType.SCHEMATIC;
        }
        if (this.RESOURCE_PACK_EXTENSIONS.includes(extension)) {
            return FileType.RESOURCE_PACK;
        }
        return FileType.UNKNOWN;
    }
    static getFileExtension(filename) {
        const lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex === -1)
            return "";
        return filename.substring(lastDotIndex);
    }
    static isSchematic(file) {
        return this.determineFileType(file) === FileType.SCHEMATIC;
    }
    static isResourcePack(file) {
        return this.determineFileType(file) === FileType.RESOURCE_PACK;
    }
    static async validateResourcePack(file) {
        // Simple validation based on extension for now
        return this.isResourcePack(file);
    }
}
Object.defineProperty(FileTypeUtility, "SCHEMATIC_EXTENSIONS", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: [
        ".schem",
        ".litematic",
        ".nbt",
        ".schematic",
        ".mcstructure",
    ]
});
Object.defineProperty(FileTypeUtility, "RESOURCE_PACK_EXTENSIONS", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: [".zip", ".mcpack"]
});
