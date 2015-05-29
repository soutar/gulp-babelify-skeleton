import ObjectCache from './ObjectCache';
import ObjectStoreDriver from './drivers/ObjectStoreDriver';

var cache = new ObjectCache(ObjectStoreDriver);

cache.set('key', 'value');
cache.setMultiple({
  'key2': { test: 1 },
  'key3': function () {
    console.log('It\'s a function!');
  }
});


console.log(cache.getMultiple(['key', 'key2', 'key3']));
