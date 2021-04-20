export default class StorageMock {
  constructor() {
    this.store = {};
    this.listener = () => {};

    this.onChanged = {
      addListener: this.addListener.bind(this),
    };

    this.local = {
      set: this.set.bind(this),
      get: this.get.bind(this),
    };
  }

  set(obj = {}, cb) {
    const changesObject = Object.keys(obj).reduce((acc, key) => {
      const newValue = obj[key];
      const oldValue = this.store[key];

      if (newValue === oldValue) {
        return acc;
      }

      return {
        ...acc,
        [key]: {
          newValue,
          ...(oldValue && { oldValue }),
        },
      };
    }, {});

    this.store = {
      ...this.store,
      ...obj,
    };

    if (Object.keys(changesObject).length > 0) {
      this.listener(changesObject);
    }

    if (cb && typeof cb === 'function') {
      cb();
    }
  }

  get(keys = [], cb) {
    const entries = Object.entries(this.store)
      .filter((entry) => keys.includes(entry[0]))
      .reduce(
        (acc, entry) => ({
          ...acc,
          [entry[0]]: entry[1],
        }),
        {},
      );

    if (cb && typeof cb === 'function') {
      cb(entries);
    }
  }

  addListener(handler) {
    this.listener = handler;
  }
}
