"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _configureStore = _interopRequireDefault(require("./configureStore"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const withRedux = (App, models, options) => {
  (0, _utils.validateConfig)({
    App,
    root: null,
    models,
    ...options
  }); // useful for debug

  const ReduxProvider = options && options.Provider || _reactRedux.Provider;
  const {
    store,
    updateReducer,
    updateSaga,
    updateModels
  } = (0, _configureStore.default)(models, options);

  const reduxApp = () => _react.default.createElement(ReduxProvider, {
    store: store
  }, _react.default.createElement(App, null));

  reduxApp.updateHelpers = {
    updateModels,
    updateReducer,
    updateSaga
  };
  return reduxApp;
};

var _default = withRedux;
exports.default = _default;