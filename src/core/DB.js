import {IndexeddbPersistence} from 'y-indexeddb';
import {LeveldbPersistence} from "y-leveldb";

export default class DB {
    constructor(doc, dbName = 'nobject-editor') {
        if (typeof window === 'undefined') {
            console.log('LevelDB initialization pending implementation.');
            this.persistence = new LeveldbPersistence(dbName, doc);
        } else {
            this.persistence = new IndexeddbPersistence(dbName, doc);
        }

        this.persistence.on('synced', () => console.log('Content from IndexedDB loaded'));
    }


    /**
     * Merges two NObjects.
     * @param {NObject} obj1 - The first NObject.
     * @param {NObject} obj2 - The second NObject.
     * @returns {Promise<NObject>} - A promise that resolves to the merged NObject.
     */
    async mergeNObjects(obj1, obj2) {
        const merged = obj1.merge(obj2);
        // TODO: Implement data merging logic as described in README.md, including:
        // - Merging all NObject content into a new merged object.
        // - Referencing the "parents" (obj1, obj2) in metadata.
        // - Using a dedicated merging strategy to handle conflicts and data resolution.
        // TODO: Implement full data merging logic as described in README.md: merging content, referencing parents, conflict resolution, and storage in both IndexedDB and LevelDB.
        // - Storing the merged object in both IndexedDB and LevelDB (if available).

        await this.persistence.setData(merged.id, merged);

        if (typeof(this.persistence)==='LevelDBPersistence') {
            // TODO: Implement LevelDB storage for merged object.
            console.log('LevelDB storage for merged object pending implementation.');
        }
        return merged;
    }
}
// TODO: Implement loading and managing tags from JSON files (README.md lines 75-79)
