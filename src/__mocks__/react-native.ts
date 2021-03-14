/**
 * React-native mock
 */

export let Dimensions = {
  get: () => {
    return {width: 100, height: 200};
  }
};

export let Platform = {
  OS: 'ios'
};

export let I18nManager = {
  isRTL: false
};

export let StyleSheet = {
  create(obj:any) {
    return Object.keys(obj).reduce((res:any, key, index) => {
      res[key] = index;
      return res;
    }, {});
  },
  flatten(arr:any) {
    return arr.reduce((res:any, item:any) => Object.assign(res, item), {});
  },
  hairlineWidth: 1
};

export default {
  Dimensions,
  Platform,
  StyleSheet,
  I18nManager
};
