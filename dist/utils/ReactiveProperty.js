export function createReactiveProxy(target, propertyConfigs) {
    const handler = {
        get(obj, prop) {
            return obj[prop];
        },
        set(obj, prop, value) {
            const config = propertyConfigs[prop];
            const oldValue = obj[prop];
            // Apply casting if defined
            if (config?.cast) {
                value = config.cast(value);
            }
            // Call beforeSet callback if defined
            if (config?.beforeSet) {
                config.beforeSet(value, oldValue, obj);
            }
            // Set the property
            obj[prop] = value;
            // Call afterSet callback if defined
            if (config?.afterSet) {
                config.afterSet(value, oldValue, obj);
            }
            return true; // Indicate that assignment was successful
        },
    };
    return new Proxy(target, handler);
}
