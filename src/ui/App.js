import './css/styles.css';
import { UIManager } from './UIManager.js';
import { UIPlugins } from './UIPlugins.js';
import { Notifier } from './Notifier.js';

const pluginManager = new UIPlugins();
const notifier = new Notifier();
const uiManager = new UIManager(pluginManager, notifier);
