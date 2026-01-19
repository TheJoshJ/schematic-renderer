export interface PropertyConfig<T> {
    cast?: (value: any) => T;
    beforeSet?: (value: T, oldValue: T, obj: any) => void;
    afterSet?: (value: T, oldValue: T, obj: any) => void;
}
export declare function createReactiveProxy<T extends object>(target: T, propertyConfigs: Partial<Record<keyof T, PropertyConfig<any>>>): T;
//# sourceMappingURL=ReactiveProperty.d.ts.map