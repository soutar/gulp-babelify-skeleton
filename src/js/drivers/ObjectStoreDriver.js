import moment from 'moment';

import ObjectStoreCacheObject from './ObjectStoreCacheObject';

export default class ObjectStoreDriver {
  store = {};

  get (key) {

    if (!this.store.hasOwnProperty(key)) {
      return null;
    }

    if (this.time < this.store[key].expiry) {
      return this.store[key].value;
    }

    delete this.store[key];
    return null;
  }

  getMultiple (keys = []) {
    let result = {};

    keys.forEach((key) => {
        let value = this.get(key);
        result[key] = value;
    });

    return result;
  }

  set (key, value, ttl) {
    let expiry = this.time + (Array.isArray(ttl) ? moment.duration.apply(null, ttl).asSeconds() : ttl);
    let object = new ObjectStoreCacheObject(value, expiry);

    this.store[this.makeKey(key)] = object;

    return true;
  }

  setMultiple (keyValuePairs = {}, ttl) {
    let expiry = this.time + (Array.isArray(ttl) ? moment.duration.apply(null, ttl).asSeconds() : ttl);

    Object.keys(keyValuePairs).forEach((key) => {
      this.set(key, keyValuePairs[key], ttl);
    });

    return true;
  }

  purge () {
    this.store = {};
    return true;
  }

  makeKey (key) {
    return key;
  }

  get time () {
    if (typeof this._time !== 'undefined') {
      return this._time;
    }

    return moment().unix();
  }

  set time (time) {
    this._time = time;
  }
}
