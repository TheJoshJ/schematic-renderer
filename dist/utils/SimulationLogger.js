// SimulationLogger.ts - Styled console logging for simulation events
export class SimulationLogger {
    static enable() {
        this.enabled = true;
    }
    static disable() {
        this.enabled = false;
    }
    static isEnabled() {
        return this.enabled;
    }
    static info(message, ...args) {
        if (!this.enabled)
            return;
        console.log(`%c${this.prefix} [SIM] ${message}`, "color: #10b981; font-weight: bold;", ...args);
    }
    static success(message, ...args) {
        if (!this.enabled)
            return;
        console.log(`%c${this.prefix} [SIM] ✓ ${message}`, "color: #22c55e; font-weight: bold;", ...args);
    }
    static warn(message, ...args) {
        if (!this.enabled)
            return;
        console.warn(`%c${this.prefix} [SIM] ⚠ ${message}`, "color: #f59e0b; font-weight: bold;", ...args);
    }
    static error(message, ...args) {
        if (!this.enabled)
            return;
        console.error(`%c${this.prefix} [SIM] ✗ ${message}`, "color: #ef4444; font-weight: bold;", ...args);
    }
    static interaction(x, y, z, blockName) {
        if (!this.enabled)
            return;
        const block = blockName ? ` (${blockName})` : "";
        console.log(`%c${this.prefix} [SIM] 👆 Interacted at [${x}, ${y}, ${z}]${block}`, "color: #3b82f6; font-weight: bold;");
    }
    static tick(tickCount, numTicks = 1) {
        if (!this.enabled)
            return;
        console.log(`%c${this.prefix} [SIM] ⏱ Tick ${tickCount} (+${numTicks})`, "color: #8b5cf6; font-weight: bold;");
    }
    static sync() {
        if (!this.enabled)
            return;
        console.log(`%c${this.prefix} [SIM] 🔄 Synced to schematic`, "color: #06b6d4; font-weight: bold;");
    }
    static state(blockName, position, oldState, newState) {
        if (!this.enabled)
            return;
        console.log(`%c${this.prefix} [SIM] 📦 ${blockName} @ [${position.join(", ")}]`, "color: #ec4899; font-weight: bold;", "\n  Old:", oldState, "\n  New:", newState);
    }
}
Object.defineProperty(SimulationLogger, "enabled", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: true
});
Object.defineProperty(SimulationLogger, "prefix", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "🔴"
});
