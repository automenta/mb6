import {nanoid} from 'nanoid';
import NObject from './NObject.js';

/**
 * Factory class for creating NObject instances.
 */
class NObjectFactory {
    /**
     * Creates a new NObject instance.
     * @param {Map} objects - The Map instance to store objects.
     * @param {UIPlugins} pluginManager - The ServerPlugins instance.
     * @param {object} initialProperties - Optional initial properties for the NObject.
     * @returns {NObject} - The created NObject instance.
     */
    static create(objects, pluginManager, initialProperties = {}) {
        const id = nanoid();
        const newObj = new NObject(id, `NObject ${id}`, '', initialProperties);
        objects.set(id, newObj);
        pluginManager?.emit('objectCreated', newObj);
        return newObj;
    }
}

export default NObjectFactory;