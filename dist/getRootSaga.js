"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _effects = require("redux-saga/effects");

const putWithNamespace = (put, namespace) => {
  return action => {
    if (action.type.indexOf(`/`) === -1) {
      action.type = `${namespace}/${action.type}`;
    }

    return put(action);
  };
};

const effectWrapper = (effect, effectCreators, config) => {
  return function* (action) {
    try {
      const ret = yield* effect(action, effectCreators);
      action.promise && action.promise.resolve(ret);
    } catch (e) {
      const {
        onError,
        dispatchError
      } = config;

      if (onError && typeof onError === 'function') {
        onError(e);
      } else if (dispatchError) {
        action.promise && action.promise.reject(e);
      } else {
        console.error(e);
      }
    }
  };
};

const getRootSaga = (models, config) => {
  return function* () {
    let model;
    let type;
    let workerSaga;

    for (let i = 0; i < models.length; i++) {
      model = models[i];
      const {
        namespace,
        effects,
        sagas
      } = model;

      if (effects) {
        const effectCreators = {
          call: _effects.call,
          select: _effects.select,
          put: putWithNamespace(_effects.put, namespace)
        };

        for (let type in effects) {
          workerSaga = effectWrapper(effects[type], effectCreators, config);
          yield (0, _effects.takeEvery)(`${namespace}/${type}`, workerSaga);
        }
      }
    }
  };
};

var _default = getRootSaga;
exports.default = _default;