import DB, {addObjectToIndex} from '../core/DB.js';
import * as Yjs from "yjs";
import {nanoid} from 'nanoid';
import NObject from "../core/NObject.js";



function create(objects, pluginManager, name, content, tags = new Yjs.Map()) {
    const id = nanoid();
    const newObj = new NObject(id, name, content, tags);
    objects.set(id, newObj);
    pluginManager?.emit('objectCreated', newObj);
    return newObj;
}

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

    createNObject = (name, content, tags) => {
        const newNObject = create(this.objects, this.pluginManager, name, content, tags);
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

}