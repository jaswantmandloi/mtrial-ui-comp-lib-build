/** @license MUI v1.0.0
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MaterialUI = {}, global.jsxRuntime));
})(this, (function (exports, jsxRuntime) { 'use strict';

  var _div;

  function Box() {
    return _div || (_div = /*#__PURE__*/jsxRuntime.jsx("div", {
      children: "Testing Box"
    }));
  }

  var _button;

  function Button() {
    return _button || (_button = /*#__PURE__*/jsxRuntime.jsx("button", {
      children: "Test Button"
    }));
  }

  exports.Box = Box;
  exports.Button = Button;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
