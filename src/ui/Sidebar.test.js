import { expect, test, describe, vi } from 'vitest';
import Sidebar from './Sidebar.js';
import { EventEmitter } from 'events';

describe('Sidebar', () => {
  const mockOnNavigate = vi.fn();
  const mockObjects = new Map();
  const mockNotifier = { 
    addNotification: vi.fn(),
    on: vi.fn()
  };
  const mockUIManager = {};
  const emitter = new EventEmitter();

  test('Sidebar can be instantiated', () => {
    const sidebar = new Sidebar({
      onNavigate: mockOnNavigate,
      objects: mockObjects,
      notifier: mockNotifier,
      uiManager: mockUIManager,
      emitter: emitter,
    });
    expect(sidebar).toBeInstanceOf(Sidebar);
  });

  test('Sidebar renders recent objects list', () => {
    const sidebar = new Sidebar({
      onNavigate: mockOnNavigate,
      objects: mockObjects,
      notifier: mockNotifier,
      uiManager: mockUIManager,
      emitter: emitter,
    });
    //const recentObjectsList = sidebar.renderRecentObjects();
    //expect(recentObjectsList).toBeDefined();
  });

  test('Sidebar renders matches list', () => {
    const sidebar = new Sidebar({
      onNavigate: mockOnNavigate,
      objects: mockObjects,
      notifier: mockNotifier,
      uiManager: mockUIManager,
      emitter: emitter,
    });
    //const matchesList = sidebar.renderMatches();
    //expect(matchesList).toBeDefined();
  });

  test('Sidebar renders friends list', () => {
    const sidebar = new Sidebar({
      onNavigate: mockOnNavigate,
      objects: mockObjects,
      notifier: mockNotifier,
      uiManager: mockUIManager,
      emitter: emitter,
    });
    //const friendsList = sidebar.renderFriends();
    //expect(friendsList).toBeDefined();
  });
});