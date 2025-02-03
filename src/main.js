import { MainView, NObjectRenderer, NotificationRenderer } from './ui/MainView.js';
import Sidebar from './ui/Sidebar.js';
import Editor from './ui/Editor.js';
import NObjectFactory from './NObjectFactory.js';
import { Notifier } from './messaging/Notifier.js';
import { PluginManager } from './plugins/PluginManager.js';
import NObject from './obj.js';


const pluginManager = new PluginManager();
const notifier = new Notifier(); // Create Notifier instance

const objects = new Map(); // Initialize objects map
const notifications = []; // Initialize notifications array

const mainView = new MainView();

const renderObjects = () => {
    const objArray = Array.from(objects.values());
    mainView.renderNObjects(objArray);
};

const renderEditor = obj => {
    const editor = new Editor({
        object: obj,
        onUpdate: updated => {
            const obj = objects.get(updated.id);
            if (obj) {
                const updatedProperties = { ...obj.properties, ...updated.indefiniteProperties, ...updated.definiteProperties };
                const updatedObj = new NObject(obj.id, obj.name, obj.content, updatedProperties, obj.tags);
                objects.set(updated.id, updatedObj);
                pluginManager.emit('objectUpdated', updatedObj);
            }
        },
        onInsertSemantic: (obj, type) => {
            const token = `[${type.toUpperCase()}]`;
            obj.content = `${obj.content ?? ''} ${token}`;
            objects.set(obj.id, obj);
            pluginManager.emit('semanticInserted', { object: obj, type });
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

const nObjectRenderer = new NObjectRenderer({ onCreate: () => NObjectFactory.create(objects, pluginManager), onEdit: renderEditor });
const notificationRenderer = new NotificationRenderer();

mainView.setNObjectRendererHandlers({ onCreate: () => NObjectFactory.create(objects, pluginManager), onEdit: renderEditor });


const sidebar = new Sidebar({
    onNavigate: (route) => {
        window.location.hash = route; // Use hash-based navigation
    }
});

document.getElementById('app').append(sidebar.el, mainView.el, notificationRenderer.el);


const routes = {
    '#notifications': () => mainView.renderNotifications(notifications),
    '#database': () => mainView.renderDatabase([]), // Pass empty array initially
    '': renderObjects // Default route
};

function routeHandler(route) {
    const routeFn = routes[route] ?? routes[''];
    if (routeFn) {
        routeFn();
    }
}

window.addEventListener('hashchange', () => routeHandler(location.hash));
routeHandler(location.hash);


notifier.on('notify', message => { // Use notifier instance
    notifications.push({ message, timestamp: Date.now() });
    if (location.hash === '#notifications') {
        mainView.renderNotifications(notifications);
    }
});
