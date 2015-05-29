export default class ObjectCache {
  defaultTtl = [15, 'minutes'];

  constructor (driver = function () {}, config) {
    if (!driver) {
      throw new Error('No driver provided');
    }

    if (config && config.hasOwnProperty('defaultTtl')) {
      this.defaultTtl = config.defaultTtl;
    }

    this.driver = new driver();
  }

  get (key) {
    return this.driver.get(key);
  }

  getMultiple (keys) {
    return this.driver.getMultiple(keys);
  }

  set (key, value, ttl = this.defaultTtl) {
    return this.driver.set(key, value, ttl);
  }

  setMultiple (keyValuePairs = {}, ttl = this.defaultTtl) {
    return this.driver.setMultiple(keyValuePairs, ttl);
  }
}
