declare class AnimationScheduler {
    private queue;
    private isRunning;
    private parent;
    constructor(parent: any);
    schedule(action: () => void, delay?: number): any;
    private runNext;
    clear(): any;
}
export { AnimationScheduler };
//# sourceMappingURL=AnimationSchedueler.d.ts.map