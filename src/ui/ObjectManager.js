import NObjectFactory from '../core/NObjectFactory.js';
import DB, { addObjectToIndex } from '../core/DB.js';

export default class ObjectManager {

    constructor(objects, pluginManager, nObjectsView, emitter) {
        this.objects = objects;
        this.pluginManager = pluginManager;
        this.nObjectsView = nObjectsView;
        this.emitter = emitter;
        (async () => {
            await this.loadObjects();
        })();
    }

    async loadObjects() {
        const objects = await DB.getObjects();
        objects.forEach(obj => this.objects.set(obj.id, obj));
        this.renderObjects();
    }

    deleteObject(obj) {
        this.objects.delete(obj.id);
        this.renderObjects();
    }

    createNObject(name, content, properties, tags) {
        const newNObject = NObjectFactory.create(this.objects, this.pluginManager, name, content, properties, tags);
        this.objects.set(newNObject.id, newNObject);
        addObjectToIndex(newNObject.id);

        this.renderObjects();
        return newNObject;
    }

    getNObject(id) {
        return this.objects.get(id);
    }

    async updateNObject(id, updates) {
        const existingNObject = this.objects.get(id);
        if (!existingNObject) {
            return null; // Or throw an error
        }
        Object.assign(existingNObject, updates); // Or a more sophisticated merging strategy
        await DB.updateObject(existingNObject);
        this.emitter.emit('objectUpdated');
        this.renderObjects();
        return existingNObject;
    }

    async deleteNObject(id) {
        await DB.deleteObjectFromIndex(id); // Remove from index
        this.objects.delete(id);
        this.renderObjects();
    }

    renderObjects() {
        this.nObjectsView.render();
    }


    createObject() {
        return NObjectFactory.create(this.objects, this.pluginManager);
    }
}