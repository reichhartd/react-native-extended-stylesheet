/**
 * Extended StyleSheet API
 */

import {StyleSheet} from 'react-native';
import Sheet from './sheet';
import Style from './style';
import Value from './value';
import vars from './replacers/vars';
import mq from './replacers/media-queries';
import child from './child';

const BUILD_EVENT = 'build';

export default class EStyleSheet {
  child:any;
  builded:any;
  sheets:any;
  globalVars:any;
  listeners:any;

  /**
   * Constructor
   */
  constructor() {
    this.child = child;
    this.builded = false;
    this.sheets = [];
    this.globalVars = null;
    this.listeners = {};
    this._proxyToOriginal();
  }

  /**
   * Creates stylesheet that will be calculated after build
   * @param {Object} obj
   * @returns {Object}
   */
  create(obj:any) {
    const sheet = new Sheet(obj);
    // todo: add options param to allow create dynamic stylesheets that should not be stored
    this.sheets.push(sheet);
    if (this.builded) {
      sheet.calc(this.globalVars);
    }
    return sheet.getResult();
  }

  /**
   * Builds all created stylesheets with passed variables
   * @param {Object} [rawGlobalVars]
   */
  build(rawGlobalVars:any) {
    this.builded = true;
    this._calcGlobalVars(rawGlobalVars);
    this._calcSheets();
    this._callListeners(BUILD_EVENT);
  }

  /**
   * Calculates particular value. For some values you need to pass prop (e.g. percent)
   * @param {*} expr
   * @param {String} [prop]
   * @returns {*}
   */
  value(expr:any, prop:any) {
    let varsArr = this.globalVars ? [this.globalVars] : [];
    return new Value(expr, prop, varsArr).calc();
  }

  /**
   * Subscribe to event. Currently only 'build' event is supported.
   * @param {String} event
   * @param {Function} listener
   */
  subscribe(event:any, listener:any) {
    this._assertSubscriptionParams(event, listener);
    this.listeners[BUILD_EVENT] = this.listeners[BUILD_EVENT] || [];
    this.listeners[BUILD_EVENT].push(listener);
    if (this.builded) {
      listener();
    }
  }

  /**
   * Unsubscribe from event. Currently only 'build' event is supported.
   * @param {String} event
   * @param {Function} listener
   */
  unsubscribe(event:any, listener:any) {
    this._assertSubscriptionParams(event, listener);
    if (this.listeners[BUILD_EVENT]) {
      this.listeners[BUILD_EVENT] = this.listeners[BUILD_EVENT].filter((item:any) => item !== listener);
    }
  }

  /**
   * Clears all cached styles.
   */
  clearCache() {
    this.sheets.forEach((sheet:any) => sheet.clearCache());
  }

  // todo: move global vars stuff to separate module
  _calcGlobalVars(rawGlobalVars:any) {
    if (rawGlobalVars) {
      this._checkGlobalVars(rawGlobalVars);
      // $theme is system variable used for caching
      rawGlobalVars.$theme = rawGlobalVars.$theme || 'default';
      this.globalVars = new Style(rawGlobalVars, [rawGlobalVars]).calc().calculatedVars;
    }
  }

  _calcSheets() {
    this.sheets.forEach((sheet:any) => sheet.calc(this.globalVars));
  }

  _callListeners(event:any) {
    if (Array.isArray(this.listeners[event])) {
      this.listeners[event].forEach((listener:any) => listener());
    }
  }

  _proxyToOriginal() {
    // see: https://facebook.github.io/react-native/docs/stylesheet.html
    const props = [
      'setStyleAttributePreprocessor',
      'hairlineWidth',
      'absoluteFill',
      'absoluteFillObject',
      'flatten',
    ];
    props.forEach(prop => {
      Object.defineProperty(this, prop, {
        get: () => (StyleSheet as any)[prop],
        enumerable: true,
      });
    });
  }

  _checkGlobalVars(rawGlobalVars:any) {
    Object.keys(rawGlobalVars).forEach(key => {
      if (!vars.isVar(key) && !mq.isMediaQuery(key)) {
        throw new Error(
          `EStyleSheet.build() params should contain global variables (start with $) ` +
          `or media queries (start with @media). Got '${key}'.`
        );
      }
    });
  }

  _assertSubscriptionParams(event:any, listener:any) {
    if (event !== BUILD_EVENT) {
      throw new Error(`Only '${BUILD_EVENT}' event is currently supported.`);
    }
    if (typeof listener !== 'function') {
      throw new Error('Listener should be a function.');
    }
  }
}
