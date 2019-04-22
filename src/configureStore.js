import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import getReducers from './getReducers';
import sagaManager from './sagaManager';
import handleModels from './handleModels';
import middleware from './middleware';
import { validModels } from './utils';

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const configureStore = (models, options={}) => {
  validModels(models);
  const { onStateChange, initialState } = options;

  const sagaMiddleware = createSagaMiddleware();

  const middlewares = reduxDevTools
    ? compose(
      applyMiddleware(sagaMiddleware, middleware),
      reduxDevTools,
    )
    : applyMiddleware(sagaMiddleware, middleware);

  const store = createStore(getReducers(models), initialState, middlewares);
  if (onStateChange) {
    store.subscribe(() => onStateChange(store.getState()));
  }
  sagaManager.startSagas(sagaMiddleware, models, options);
  handleModels(models, store, options);

  const updateReducer = models => {
    validModels(models);
    store.replaceReducer(getReducers(models));
  };
  const updateSaga = models => {
    validModels(models);
    sagaManager.cancelSagas(store);
    sagaManager.startSagas(sagaMiddleware, models, options);
  };
  const updateModels = models => {
    updateReducer(models);
    updateSaga(models);
    handleModels(models, store, options);
  };
  return {
    store,
    updateModels,
    updateReducer,
    updateSaga,
  };
}

export default configureStore;
