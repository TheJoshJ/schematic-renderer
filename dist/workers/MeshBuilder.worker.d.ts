type PaletteGeometryData = {
    index: number;
    occlusionFlags: number;
    geometries: Array<{
        positions: Float32Array;
        normals: Float32Array;
        uvs: Float32Array;
        indices: Uint16Array | Uint32Array;
        materialIndex: number;
    }>;
};
type ChunkBuildRequest = {
    chunkId: string;
    blocks: number[][] | Int32Array;
    chunkOrigin?: [number, number, number];
};
declare const POSITION_SCALE = 1024;
declare const NORMAL_SCALE = 127;
declare const paletteGeometries: Map<number, PaletteGeometryData>;
declare function updatePalette(paletteData: PaletteGeometryData[]): void;
declare function buildChunk(request: ChunkBuildRequest): void;
declare function mergeGeometriesWithCulling(geometries: any[], positions: number[], _occlusionFlags: number[], voxelMap: Int32Array, getIndex: (x: number, y: number, z: number) => number, originX: number, originY: number, originZ: number): {
    positions: Int16Array<ArrayBuffer>;
    normals: Int8Array<ArrayBuffer>;
    uvs: Float32Array<ArrayBuffer>;
    indices: Uint32Array<ArrayBuffer> | Uint16Array<ArrayBuffer>;
    groups: {
        start: number;
        count: number;
        materialIndex: number;
    }[];
} | null;
//# sourceMappingURL=MeshBuilder.worker.d.ts.map