import { call, put, select, takeEvery } from 'redux-saga/effects';

const putWithNamespace = (put, namespace) => {
  return action => {
    if (action.type.indexOf(`/`) === -1) {
      action.type = `${namespace}/${action.type}`;
    }
    return put(action);
  };
}

const effectWrapper = (effect, effectCreators, config) => {
  return function* (action) {
    try {
      const ret = yield* effect(action, effectCreators);
      action.promise && action.promise.resolve(ret);
    } catch (e) {
      const { onError, dispatchError } = config;
      if (onError && typeof onError === 'function') {
        onError(e);
      } else if (dispatchError) {
        action.promise && action.promise.reject(e);
      } else {
        console.error(e);
      }
    }
  };
}

const getRootSaga = (models, config) => {
  return function* () {
    let model;
    let type;
    let workerSaga;

    for (let i = 0; i < models.length; i++) {
      model = models[i];
      const { namespace, effects, sagas } = model;
      if (effects) {
        const effectCreators = {
          call,
          select,
          put: putWithNamespace(put, namespace),
        };

        for (let type in effects) {
          workerSaga = effectWrapper(effects[type], effectCreators, config);
          yield takeEvery(`${namespace}/${type}`, workerSaga);
        }
      }
    }
  }
  ;
}

export default getRootSaga;
