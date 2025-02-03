import './css/styles.css';
import {MainView, NotificationRenderer} from './MainView.js';
import Sidebar from './Sidebar.js';
import Editor from './Editor.js';
import NObjectFactory from '../core/NObjectFactory.js';
import {Notifier} from './Notifier.js';
import {UIPlugins} from './UIPlugins.js';
import NObject from '../core/obj.js';


const pluginManager = new UIPlugins();
const notifier = new Notifier();

const objects = new Map();
const notifications = [];

const mainView = new MainView();

const renderObjects = () => {
    mainView.renderNObjects(Array.from(objects.values()));
};

const renderEditor = obj => {
    const editor = new Editor({
        object: obj,
        onUpdate: updated => {
            const obj = objects.get(updated.id);
            if (obj) {
                const updatedProperties = {...obj.properties, ...updated.indefiniteProperties, ...updated.definiteProperties};
                const updatedObj = new NObject(obj.id, obj.name, obj.content, updatedProperties, obj.tags);
                objects.set(updated.id, updatedObj);
                pluginManager.emit('objectUpdated', updatedObj);
            }
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
            notifier.notify(`NObject signed: ${signature}`); // Use notifier instance
            pluginManager.emit('objectSigned', obj);
        },
        pluginManager
    });
    mainView.renderEditor(editor.el);
    pluginManager.emit('editorOpened', obj);
};

const notificationRenderer = new NotificationRenderer();

mainView.setNObjectRendererHandlers({
    onCreate: () => NObjectFactory.create(objects, pluginManager),
    onEdit: renderEditor
});

const sidebar = new Sidebar({
    onNavigate: (route) => {
        window.location.hash = route; // Use hash-based navigation
    }
});

const routes = {
    '#notifications': () => mainView.renderNotifications(notifications),
    '#database': () => mainView.renderDatabase([]), // Pass empty array initially
    '': renderObjects // Default route
};

function routeHandler(route) {
    (routes[route] ?? routes[''])?.();
}

notifier.on('notify', message => { // Use notifier instance
    notifications.push({message, timestamp: Date.now()});
    if (location.hash === '#notifications')
        mainView.renderNotifications(notifications);
});

window.addEventListener('hashchange', () => routeHandler(location.hash));
routeHandler(location.hash);

document.getElementById('app').append(sidebar.el, mainView.el, notificationRenderer.el);
