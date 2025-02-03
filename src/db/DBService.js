import {IndexeddbPersistence} from 'y-indexeddb';

export default class DBService {
    constructor(doc, dbName = 'nobject-editor') {
        this.persistence = new IndexeddbPersistence(dbName, doc);
        this.persistence.on('synced', () => console.log('Content from IndexedDB loaded'));
        // LevelDB for server-side persistence
        this.leveldb = null; // Initialize as null, to be initialized only on server-side

        // TODO: Add LevelDB initialization for server-side persistence (if applicable)
        // Example:
        if (typeof window === 'undefined') { // Check if running in Node.js environment
            this.initLevelDB();
        }
    }

    initLevelDB() {
        // TODO: Initialize LevelDB for server-side persistence.
        // Ensure this only runs in a Node.js environment.
        if (typeof window === 'undefined') {
            // Example using 'level' library (install if needed: npm install level)
            // const level = require('level');
            // this.leveldb = level('./leveldb-data'); // Store LevelDB data in './leveldb-data' directory
            console.log('LevelDB initialization pending implementation.');
            // Consider adding error handling and configuration options.
        } else {
            console.warn('LevelDB initialization skipped: not in Node.js environment.');
        }
    }

    /**
     * Merges two NObjects.
     * @param {NObject} obj1 - The first NObject.
     * @param {NObject} obj2 - The second NObject.
     * @returns {Promise<NObject>} - A promise that resolves to the merged NObject.
     */
    async mergeNObjects(obj1, obj2) {
        const merged = obj1.merge(obj2);
        // TODO: Implement data merging logic as described in README.md.
        // - Merge all NObject content into a new merged object.
        // - Merged object should reference the "parents" (obj1, obj2) in metadata.
        // - Consider using a dedicated merging strategy to handle conflicts and data resolution.

        // TODO: Store the merged object in the database
        // Example (IndexedDB):
        await this.persistence.setData(merged.id, merged);
        if (this.leveldb) {
            // TODO: Store the merged object in LevelDB.
            // - Serialize the merged object to JSON before storing in LevelDB.
            // - Handle potential errors during LevelDB write operations.
            // Example (LevelDB):
            // await this.leveldb.put(merged.id, JSON.stringify(merged));
            console.log('LevelDB storage for merged object pending implementation.');
        }
        return merged;
    }
}
