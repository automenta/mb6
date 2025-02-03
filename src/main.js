import * as Y from 'yjs';
import {nanoid} from 'nanoid';
import Notifier from './messaging/Notifier.js';
import Sidebar from './ui/Sidebar.js';
import MainView from './ui/MainView.js';
import Editor from './ui/Editor.js';
import {insertTagWidget} from './ui/TagWidget.js';
import NetworkService from './net/NetworkService.js';
import DBService from './db/DBService.js';
import {PluginManager} from './plugins/PluginManager.js';

const doc = new Y.Doc();
const objects = doc.getMap('objects');
const notifications = doc.getArray('notifications');

new DBService(doc);
new NetworkService(doc);
window.insertTagWidget = insertTagWidget;

const pluginManager = new PluginManager();
window.registerClientPlugin = pluginManager.register.bind(pluginManager);

const createNObject = () => {
    const id = nanoid();
    const newObj = {id, name: `NObject ${id}`, content: ''};
    objects.set(id, newObj);
    pluginManager.emit('objectCreated', newObj);
    renderObjects();
};

const renderObjects = () => mainView.renderNObjects([...objects.values()]);

const renderEditor = obj => {
    const editor = new Editor({
        object: obj,
        onUpdate: updated => {
            objects.set(updated.id, updated);
            pluginManager.emit('objectUpdated', updated);
        },
        onInsertSemantic: (obj, type) => {
            const token = `[${type.toUpperCase()}]`;
            obj.content = `${obj.content ?? ''} ${token}`;
            objects.set(obj.id, obj);
            pluginManager.emit('semanticInserted', {object: obj, type});
            renderEditor(obj);
        },
        onSign: obj => {
            const signature = `sig-${obj.id}`;
            obj.signature = signature;
            objects.set(obj.id, obj);
            Notifier.notify(`NObject signed: ${signature}`);
            pluginManager.emit('objectSigned', obj);
        },
        pluginManager
    });
    mainView.renderEditor(editor.el);
    pluginManager.emit('editorOpened', obj);
};

const sidebar = new Sidebar({onNavigate: routeHandler});
const mainView = new MainView({onCreate: createNObject, onEdit: renderEditor});
document.getElementById('app').append(sidebar.el, mainView.el);

function routeHandler(route) {
    switch (route) {
        case '#notifications':
            mainView.renderNotifications([...notifications.toArray()]);
            break;
        case '#database':
            mainView.renderDatabase();
            break;
        default:
            renderObjects();
            break;
    }
}

window.addEventListener('hashchange', () => routeHandler(location.hash));
routeHandler(location.hash);
pluginManager.emit('postInit', {sidebar, mainView, doc, objects, notifications});
        