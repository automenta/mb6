import ListView from './ListView.js';

export default class NObjectsView {
    constructor(objects, pluginManager) {
        this.el = document.createElement('div');
        this.objects = objects;
        this.pluginManager = pluginManager;
        this.listView = new ListView(this.objects, this.pluginManager); // Initialize ListView here


    }

    render() {

        this.listView.render(); // Render the ListView
        this.el.innerHTML = '';
        this.el.appendChild(this.listView.el);


    }
}