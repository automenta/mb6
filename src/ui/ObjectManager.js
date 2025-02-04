import NObjectFactory from '../core/NObjectFactory.js';

export default class ObjectManager {
    constructor(objects, pluginManager, nObjectsView) {
        this.objects = objects;
        this.pluginManager = pluginManager;
        this.nObjectsView = nObjectsView;
    }

    createObject() {
        return NObjectFactory.create(this.objects, this.pluginManager);
    }

    deleteObject(obj) {
        this.objects.delete(obj.id);
        this.renderObjects();
    }

    renderObjects() {
        this.nObjectsView.render();
    }

}