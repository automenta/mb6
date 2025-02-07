export class UIPlugins {
    constructor() {
        this.plugins = [];
    }

    add = plugin => {
        this.plugins.push(plugin);
        console.log(`[Client Plugin Manager] Registered plugin: ${plugin.name ?? 'Unnamed plugin'}`);
        plugin.init?.();
    };

    emit = (eventName, data) => this.plugins.forEach(plugin => plugin[eventName]?.(data));

}