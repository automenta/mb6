import * as Y from 'yjs'
import {IndexeddbPersistence} from 'y-indexeddb';

const doc = new Y.Doc()
const dbName = 'nobject-editor';
const persistence = new IndexeddbPersistence(dbName, doc);

persistence.on('synced', () => console.log('Content from IndexedDB loaded'));

export const addObjectToIndex = async (objectId) => {
    const index = await persistence.get('objectIndex') || [];
    index.push(objectId);
    await persistence.set('objectIndex', index);
};

export default class DB {
  
    /**
     * Merges two NObjects.
     * @param {NObject} obj1 - The first NObject.
     * @param {NObject} obj2 - The second NObject.
     * @returns {Promise<NObject>} - A promise that resolves to the merged NObject.
     */
    mergeNObjects = async (obj1, obj2) => {
        const merged = obj1.merge(obj2);
        // Implement data merging logic as described in README.md, including:
        // - Merging all NObject content into a new merged object.
        // - Referencing the "parents" (obj1, obj2) in metadata.
        // - Using a dedicated merging strategy to handle conflicts and data resolution.
        merged.metadata = {
            parents: [obj1.id, obj2.id],
            mergeStrategy: 'latestWins' // Example strategy, replace with actual implementation
        };
        // Store the merged object using IndexedDB
        await persistence.set(merged.id, merged);
        await addObjectToIndex(merged.id);

        return merged;
    }

    static getObjects = async () => {
        const index = await persistence.get('objectIndex') || [];
        const objects = [];
        for (const objectId of index) {
            const obj = await persistence.get(objectId);
            if (obj) {
                objects.push(obj);
            }
        }
        return objects;
    }
  
    static updateObject = async (object) => {
        await persistence.set(object.id, object);
    }

    static deleteObjectFromIndex = async (objectId) => {
        let index = await persistence.get('objectIndex') || [];
        index = index.filter(id => id !== objectId);
        await persistence.set('objectIndex', index);
    }

}
// TODO: Implement loading and managing tags from JSON files (README.md lines 75-79)
