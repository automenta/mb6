global.indexedDB = {
  open: () => {
    return {
      onsuccess: null,
      onerror: null,
      result: {
        createObjectStore: () => {},
        transaction: () => {
          return {
            objectStore: () => {}
          };
        }
      }
    };
  },
  deleteDatabase: () => {}
};

global.fetch = vi.fn(() => Promise.resolve({
  json: () => Promise.resolve({})
}));