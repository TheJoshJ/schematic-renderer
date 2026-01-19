class AnimationScheduler {
    constructor(parent) {
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "isRunning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.parent = parent;
    }
    schedule(action, delay = 0) {
        this.queue.push({ action, delay });
        if (!this.isRunning) {
            this.runNext();
        }
        return this.parent; // Return the parent object for method chaining
    }
    runNext() {
        if (this.queue.length === 0) {
            this.isRunning = false;
            return;
        }
        this.isRunning = true;
        const { action, delay } = this.queue.shift();
        setTimeout(() => {
            action();
            this.runNext();
        }, delay);
    }
    clear() {
        this.queue = [];
        this.isRunning = false;
        return this.parent; // Return the parent object for method chaining
    }
}
export { AnimationScheduler };
