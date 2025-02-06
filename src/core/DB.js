import * as Yjs from 'yjs';
import {IndexeddbPersistence} from 'y-indexeddb';

const doc = new Yjs.Doc();
const dbName = 'nobject-editor';
const persistence = new IndexeddbPersistence(dbName, doc);

persistence.on('synced', () => {
});

export const addObjectToIndex = async (objectId) => {
    try {
        const index = await persistence.get('objectIndex') || [];
        index.push(objectId);
        await persistence.set('objectIndex', index);
    } catch (error) {
        console.error('Error adding object to index:', error);
    }
};

export default class DB {

    static getObjects = async () => {
        try {
            const index = await persistence.get('objectIndex') || [];
            const objects = [];
            for (const objectId of index) {
                const obj = await persistence.get(objectId);
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
            await persistence.set(object.id, object);
        } catch (error) {
            console.error('Error updating object:', error);
        }
    }

    static deleteObjectFromIndex = async (objectId) => {
        try {
            let index = await persistence.get('objectIndex') || [];
            index = index.filter(id => id !== objectId);
            await persistence.set('objectIndex', index);
        } catch (error) {
            console.error('Error deleting object from index:', error);
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
        const merged = new NObject({
            ...obj1,
            ...obj2,
            content: Yjs.mergeUpdates(Yjs.encodeStateAsUpdate(obj1.content), Yjs.encodeStateAsUpdate(obj2.content)),
            properties: {...obj1.properties, ...obj2.properties}
        });

        // Set metadata with parent references and merge strategy
        merged.metadata = {
            parents: [obj1.id, obj2.id],
            mergeStrategy: 'latestWins',
            mergedAt: new Date().toISOString()
        };
        // Store the merged object using IndexedDB
        await persistence.set(merged.id, merged);
        await addObjectToIndex(merged.id);

        return merged;
    }

}
// TODO: Implement loading and managing tags from JSON files (README.md lines 75-79)
