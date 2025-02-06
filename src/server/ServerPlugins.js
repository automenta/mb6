/**
 * Server Plugin Manager
 *
 * Plugins can hook into lifecycle events such as:
 *   - init, onPeerDiscovery, onPeerConnect, onPeerDisconnect,
 *   - onConnection, onDisconnect, onBeforeUpdate, onAfterUpdate, onMessage, etc.
 */
export class ServerPlugins {
    constructor() {
        this.plugins = [];
    }

    /**
     * Registers a plugin with the server.
     * @param {object} plugin - The plugin to register.
     */
    register(plugin) {
        this.plugins.push(plugin);
        console.log(`[Server Plugin Manager] Registered plugin: ${plugin.name ?? 'Unnamed plugin'}`);
        plugin.init?.();
    }

    /**
     * Emits an event to all registered plugins.
     * @param {string} eventName - The name of the event to emit.
     * @param {any} data - The data to pass to the event handlers.
     */
    async emit(eventName, data) {
        for (const plugin of this.plugins) {
            try {
                if (typeof plugin[eventName] === 'function') {
                    await plugin[eventName](data);
                }
            } catch (error) {
                console.error(`[Server Plugin Manager] Error in plugin ${plugin.name ?? 'Unnamed plugin'} event handler for ${eventName}:`, error);
            }
        }
    }
}