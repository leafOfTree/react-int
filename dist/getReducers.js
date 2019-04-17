"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

const getReducers = models => {
  const rootReducers = {};
  models.forEach(model => {
    const {
      namespace,
      state,
      reducers
    } = model;
    const initState = state || {};

    rootReducers[namespace] = (state = initState, action) => {
      const type = action.type;

      if (type && type.indexOf(`${namespace}/`) === 0) {
        const key = type.replace(`${namespace}/`, '');
        const reducer = reducers[key];

        if (reducer) {
          return reducer(state, action);
        }
      }

      return state;
    };
  });
  return (0, _redux.combineReducers)(rootReducers);
};

var _default = getReducers;
exports.default = _default;