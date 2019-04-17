"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _effects = require("redux-saga/effects");

var _getRootSaga = _interopRequireDefault(require("./getRootSaga"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCancelableSaga(saga) {
  if (process.env.NODE_ENV === 'production') {
    return saga;
  } else {
    return function* () {
      const sagaTask = yield (0, _effects.fork)(saga);
      yield (0, _effects.take)(CANCEL_SAGAS_HMR);
      yield (0, _effects.cancel)(sagaTask);
    };
  }
}

const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR';
const sagaManager = {
  startSagas(sagaMiddleware, models, options) {
    const saga = createCancelableSaga((0, _getRootSaga.default)(models, options));
    sagaMiddleware.run(saga);
  },

  cancelSagas(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR
    });
  }

};
var _default = sagaManager;
exports.default = _default;