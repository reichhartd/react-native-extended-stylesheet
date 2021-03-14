/**
 * Utils
 */

export default {
  excludeKeys,
  isObject,
};

/**
 * Returns new object with excluded keys
 * @param {Object} obj
 * @param {Array|Object} keys
 */
function excludeKeys(obj:any, keys:any) {
  keys = Array.isArray(keys)
    ? keys
    : (keys ? Object.keys(keys) : []);
  return Object.keys(obj).reduce((res:any, key) => {
    if (keys.indexOf(key) === -1) {
      res[key] = obj[key];
    }
    return res;
  }, {});
}

/**
 * Is object
 * @param {*} obj
 */
function isObject(obj:any) {
  return typeof obj === 'object' && obj !== null;
}
