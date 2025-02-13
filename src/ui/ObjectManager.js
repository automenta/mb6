import DB, { addObjectToIndex } from '../core/DB.js';
import * as Yjs from "yjs";
import { nanoid } from 'nanoid';
import NObject from "../core/NObject.js";

function create(objects, name, content, tags = new Yjs.Map()) {
    const id = nanoid();
    const newObj = new NObject(id, name, content, tags);
    objects.set(id, newObj);
    return newObj;
}

export default class ObjectManager {

    constructor(objects, emitter) {
        this.objects = objects;
        this.emitter = emitter;
        DB.getObjects().then((x) => {
            x.forEach(obj => objects.set(obj.id, obj));
            this.emitter.emit('objectsLoaded', objects);
        });
    }


    deleteObject = obj => {
        this.objects.delete(obj.id);
        this.emitter.emit('objectDeleted', obj);

    };

    createNObject = (name, content, tags) => {
        const newNObject = create(this.objects, name, content, tags);
        this.objects.set(newNObject.id, newNObject);
        addObjectToIndex(newNObject.id);
        this.emitter.emit('objectCreated', newNObject);
        return newNObject;
    };

    getNObject = id => this.objects.get(id);


    updateNObject = async (id, updates) => {
        const existingNObject = this.objects.get(id);
        if (!existingNObject) return null;
        Object.assign(existingNObject, updates);
        await DB.updateObject(existingNObject);
        this.emitter.emit('objectUpdated');
        return existingNObject;
    };

    deleteNObject = async id => {
        await DB.deleteObjectFromIndex(id);
        this.objects.delete(id);
        this.emitter.emit('objectDeleted', id);
    };

    renderObjects = () => this.nObjectsView.render();

}