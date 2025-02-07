import { expect, test, describe, vi } from 'vitest';
import Editor from '../src/ui/Editor.js';
import EditorContent from '../src/ui/Editor.Content.js'; // Import EditorContent


vi.mock('./UIUtil', () => {
  return {
    loadTagSchema: () => Promise.resolve({}),
    debounce: (callback, delay) => {
      let timeout;

      const debounceCallback = (args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(null, args), delay);
      };

      return {
        cancel: () => clearTimeout(timeout),
        then: (args, symbol) => {
          if (typeof args === 'number') {
            debounceCallback(args);
          } else {
            debounceCallback([args, symbol]);
          }
        }
      };
    }
  };
});

describe('Editor', () => {
  const mockObject = { id: '1', name: 'Test Object', content: 'Test Content', tags: [] };

  test('Editor can be instantiated', () => {
    const editor = new Editor({object: mockObject});
    expect(editor).toBeInstanceOf(Editor);
  });

  test('Editor saves the current object', () => {
    const editor = new Editor({ object: mockObject });
    const saveCurrentObjectSpy = vi.spyOn(editor, 'saveCurrentObject');
    editor.saveCurrentObject();
    expect(saveCurrentObjectSpy).toHaveBeenCalled();
  });

  test('EditorContent can be instantiated', () => { // Add test for EditorContent
    const mockYText = { observe: vi.fn() };
    const editorContent = new EditorContent(mockYText, mockObject, null, null, null);
    expect(editorContent).toBeInstanceOf(EditorContent);
  });
});