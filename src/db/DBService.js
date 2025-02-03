import {IndexeddbPersistence} from 'y-indexeddb';

export default class DBService {
    constructor(doc, dbName = 'nobject-editor') {
        this.persistence = new IndexeddbPersistence(dbName, doc);
        this.persistence.on('synced', () => console.log('Content from IndexedDB loaded'));
    }
}
        