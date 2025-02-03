/**
 * Server Plugin Manager
 *
 * Plugins can hook into lifecycle events such as:
 *   - init, onPeerDiscovery, onPeerConnect, onPeerDisconnect,
 *   - onConnection, onDisconnect, onBeforeUpdate, onAfterUpdate, onMessage, etc.
 */
export class PluginManager {
    constructor() {
        this.plugins = [];
    }

    register(plugin) {
        this.plugins.push(plugin);
        console.log(`[Server Plugin Manager] Registered plugin: ${plugin.name ?? 'Unnamed plugin'}`);
        plugin.init?.();
    }

    async emit(eventName, data) {
        for (const plugin of this.plugins) {
            if (typeof plugin[eventName] === 'function') await plugin[eventName](data);
        }
    }
}
        