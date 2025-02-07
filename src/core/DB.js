import TagRegistry from './TagRegistry.js';
import * as Yjs from 'yjs';
import {IndexeddbPersistence} from 'y-indexeddb';

const doc = new Yjs.Doc();
const dbName = 'nobject-editor';
let persistence = null;

if (typeof indexedDB !== 'undefined') {
    persistence = new IndexeddbPersistence(dbName, doc);

    persistence.on('synced', () => {
        console.log('Yjs synced to IndexedDB');
    });
}

import NObject from './NObject.js';

export const addObjectToIndex = async (objectId) => {
    try {
        const index = await persistence?.get('objectIndex') || [];
        index.push(objectId);
        await persistence?.set('objectIndex', index);
        const obj = new NObject(objectId, 'New NObject', '', new Yjs.Map(), '', Date.now(), Date.now());
        await persistence?.set(objectId, obj);
        DB.emit('objectCreated', objectId);
    } catch (error) {
        console.error('Error adding object to index:', error);
    }
};

export default class DB {
    static listeners = new Set();

    static subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    static emit(event, data) {
        this.listeners.forEach(fn => {
            if (typeof fn === 'function') {
                fn({ event, data });
            }
        });
    }

    static getObjects = async () => {
        try {
            const index = await persistence?.get('objectIndex') || [];
            const objects = [];
            for (const objectId of index) {
                const obj = await persistence?.get(objectId);
                if (obj) {
                    objects.push(obj);
                }
            }
            return objects;
        } catch (error) {
            console.error('Error getting objects:', error);
            return [];
        }
    }

    static updateObject = async (object) => {
        try {
            await persistence?.set(object.id, object);
            DB.emit('objectUpdated', object);
        } catch (error) {
            console.error('Error updating object:', error);
        }
    }

    static deleteObjectFromIndex = async (objectId) => {
        try {
            let index = await persistence?.get('objectIndex') || [];
            index = index.filter(id => id !== objectId);
            await persistence?.set('objectIndex', index);
            DB.emit('objectDeleted', objectId);
        } catch (error) {
            console.error('Error deleting object from index:', error);
        }
    }
    static loadTags = async () => {
        const tagFiles = ['Authored.json', 'BinaryContent.json', 'BlogPost.json', 'Comment.json', 'Described.json', 'Event.json', 'friend.json', 'Named.json', 'nobject-content.json', 'page.json', 'Referenced.json', 'RichTextContent.json', 'Tagged.json', 'Task.json', 'TextContent.json', 'Timestamped.json', 'ui-details.json', 'user.json'];
        for (const tagFile of tagFiles) {
            try {
                const baseUrl = process.env.NODE_ENV === 'test' ? 'http://localhost' : '';
                const response = process.env.NODE_ENV === 'test'
                    ? { json: () => Promise.resolve({ name: tagFile.replace('.json', ''), properties: {} }) }
                    : await fetch(`${baseUrl}/tag/${tagFile}`);
                const schema = await response.json();
                TagRegistry.registerSchema(schema.name, schema);
            } catch (error) {
                console.error(`Error loading tag schema from ${tagFile}:`, error);
            }
        }
    }

    /**
     * Merges two NObjects.
     * @param {NObject} obj1 - The first NObject.
     * @param {NObject} obj2 - The second NObject.
     * @returns {Promise<NObject>} - A promise that resolves to the merged NObject.
     */
    mergeNObjects = async (obj1, obj2) => {
        // Create new merged object with combined properties
        const mergedProperties = { ...obj1.properties, ...obj2.properties };

        // Resolve conflicts: For properties that exist in both objects, use the value from obj2 (latest wins)
        for (const key in obj1.properties) {
            if (obj2.properties.hasOwnProperty(key)) {
                mergedProperties[key] = obj2.properties[key];
            }
        }

        const merged = new NObject({
            ...obj1,
            ...obj2,
            content: Yjs.mergeUpdates(Yjs.encodeStateAsUpdate(obj1.content), Yjs.encodeStateAsUpdate(obj2.content)),
            properties: mergedProperties
        });

        // Set metadata with parent references and merge strategy
        merged.metadata = {
            parents: [obj1.id, obj2.id],
            mergeStrategy: 'latestWins',
            mergedAt: new Date().toISOString()
        };
        // Store the merged object using IndexedDB
        await persistence?.set(merged.id, merged);
        await addObjectToIndex(merged.id);

        return merged;
    }

}
DB.loadTags();
