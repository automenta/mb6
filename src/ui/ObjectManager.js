import NObjectFactory from '../core/NObjectFactory.js';
import DB, { addObjectToIndex } from '../core/DB.js';

export default class ObjectManager {

    constructor(objects, pluginManager, nObjectsView, emitter) {
        this.objects = objects;
        this.pluginManager = pluginManager;
        this.nObjectsView = nObjectsView;
        this.emitter = emitter;
        this.loadObjects();
    }

    loadObjects = async () => {
        (await DB.getObjects()).forEach(obj => this.objects.set(obj.id, obj));
        this.renderObjects();

    };

    deleteObject = obj => {
        this.objects.delete(obj.id);
        this.renderObjects();

    };

    createNObject = (name, content, properties, tags) => {
        const newNObject = NObjectFactory.create(this.objects, this.pluginManager, name, content, properties, tags);
        this.objects.set(newNObject.id, newNObject);
        addObjectToIndex(newNObject.id);
        this.renderObjects();
        return newNObject;

    };

    getNObject = id => this.objects.get(id);


    updateNObject = async (id, updates) => {
        const existingNObject = this.objects.get(id);
        if (!existingNObject) return null;
        Object.assign(existingNObject, updates);
        await DB.updateObject(existingNObject);
        this.emitter.emit('objectUpdated');
        this.renderObjects();
        return existingNObject;


    };

    deleteNObject = async id => {
        await DB.deleteObjectFromIndex(id);
        this.objects.delete(id);
        this.renderObjects();

    };

    renderObjects = () => this.nObjectsView.render();



    createObject = () => NObjectFactory.create(this.objects, this.pluginManager);

}