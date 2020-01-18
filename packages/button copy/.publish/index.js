"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Component = require("./Component");

Object.keys(_Component).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Component[key];
    }
  });
});