"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _getReducers = _interopRequireDefault(require("./getReducers"));

var _sagaManager = _interopRequireDefault(require("./sagaManager"));

var _handleModels = _interopRequireDefault(require("./handleModels"));

var _middleware = _interopRequireDefault(require("./middleware"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const configureStore = (models, options = {}) => {
  (0, _utils.validateModels)(models);
  const {
    onStateChange,
    initialState
  } = options;
  const sagaMiddleware = (0, _reduxSaga.default)();
  const middlewares = reduxDevTools ? (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware, _middleware.default), reduxDevTools) : (0, _redux.applyMiddleware)(sagaMiddleware, _middleware.default);
  const store = (0, _redux.createStore)((0, _getReducers.default)(models), initialState, middlewares);

  if (onStateChange) {
    store.subscribe(() => onStateChange(store.getState()));
  }

  _sagaManager.default.startSagas(sagaMiddleware, models, options);

  (0, _handleModels.default)(models, store, options);

  const updateReducer = models => {
    (0, _utils.validateModels)(models);
    store.replaceReducer((0, _getReducers.default)(models));
  };

  const updateSaga = models => {
    (0, _utils.validateModels)(models);

    _sagaManager.default.cancelSagas(store);

    _sagaManager.default.startSagas(sagaMiddleware, models, options);
  };

  const updateModels = models => {
    updateReducer(models);
    updateSaga(models);
    (0, _handleModels.default)(models, store, options);
  };

  return {
    store,
    updateModels,
    updateReducer,
    updateSaga
  };
};

var _default = configureStore;
exports.default = _default;