import {
  call, put, select, fork, takeEvery, takeLatest, takeLeading,
  cancelled,
} from 'redux-saga/effects';

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
}

const effectWrapper = (effect, effectCreators, config) => {
  return function* (action) {
    try {
      const returnValue = yield* effect(action, effectCreators);
      action.promise && action.promise.resolve(returnValue);
    } catch (e) {
      const { onError, dispatchError } = config;
      if (onError && (typeof onError === 'function')) {
        onError(e);
      } else if (dispatchError) {
        action.promise && action.promise.reject(e);
      } else {
        console.error(e);
      }
    } finally {
      if (yield cancelled()) {
        // Action is cancelled
      }
    }
  };
}

const getRootSaga = (models, config) => {
  return function* () {
    let model;
    let workerSaga;

    for (let i = 0; i < models.length; i++) {
      model = models[i];
      const { namespace, effects, leadings, latests, sagas } = model;

      const effectCreators = {
        call,
        select,
        put: putWithNamespace(put, namespace),
      };

      for (let type in effects) {
        workerSaga = effectWrapper(effects[type], effectCreators, config);
        yield takeEvery(`${namespace}/${type}`, workerSaga);
      }

      for (let type in leadings) {
        workerSaga = effectWrapper(leadings[type], effectCreators, config);
        yield takeLeading(`${namespace}/${type}`, workerSaga);
      }

      for (let type in latests) {
        workerSaga = effectWrapper(latests[type], effectCreators, config);
        yield takeLatest(`${namespace}/${type}`, workerSaga);
      }

      for (let watcherSaga in sagas) {
        yield fork(sagas[watcherSaga]);
      }
    }
  }
}

export default getRootSaga;
