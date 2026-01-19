export declare class SimulationLogger {
    private static enabled;
    private static prefix;
    static enable(): void;
    static disable(): void;
    static isEnabled(): boolean;
    static info(message: string, ...args: any[]): void;
    static success(message: string, ...args: any[]): void;
    static warn(message: string, ...args: any[]): void;
    static error(message: string, ...args: any[]): void;
    static interaction(x: number, y: number, z: number, blockName?: string): void;
    static tick(tickCount: number, numTicks?: number): void;
    static sync(): void;
    static state(blockName: string, position: [number, number, number], oldState: any, newState: any): void;
}
//# sourceMappingURL=SimulationLogger.d.ts.map