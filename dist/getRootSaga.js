"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _effects = require("redux-saga/effects");

const putWithNamespace = (put, namespace) => {
  return action => {
    if (!action.type) {
      throw new Error('action must have type.');
    }

    if (action.type.indexOf(`/`) === -1) {
      action.type = `${namespace}/${action.type}`;
    }

    return put(action);
  };
};

const effectWrapper = (effect, effectCreators, config) => {
  return function* (action) {
    try {
      const returnValue = yield* effect(action, effectCreators);
      action.promise && action.promise.resolve(returnValue);
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
        // eslint-disable-next-line no-console
        console.error(e);
      }
    } finally {
      if (yield (0, _effects.cancelled)()) {// Action is cancelled
      }
    }
  };
};

const getRootSaga = (models, config) => {
  return function* () {
    let model;
    let workerSaga;

    for (let i = 0; i < models.length; i++) {
      model = models[i];
      const {
        namespace,
        effects,
        leadings,
        latests,
        sagas
      } = model;
      const effectCreators = {
        call: _effects.call,
        select: _effects.select,
        put: putWithNamespace(_effects.put, namespace)
      };

      for (let type in effects) {
        workerSaga = effectWrapper(effects[type], effectCreators, config);
        yield (0, _effects.takeEvery)(`${namespace}/${type}`, workerSaga);
      }

      for (let type in leadings) {
        workerSaga = effectWrapper(leadings[type], effectCreators, config);
        yield (0, _effects.takeLeading)(`${namespace}/${type}`, workerSaga);
      }

      for (let type in latests) {
        workerSaga = effectWrapper(latests[type], effectCreators, config);
        yield (0, _effects.takeLatest)(`${namespace}/${type}`, workerSaga);
      }

      for (let watcherSaga in sagas) {
        yield (0, _effects.fork)(sagas[watcherSaga]);
      }
    }
  };
};

var _default = getRootSaga;
exports.default = _default;