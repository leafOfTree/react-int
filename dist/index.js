"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactRedux = require("react-redux");

var _configureStore = _interopRequireDefault(require("./configureStore"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const start = (App, root, models, options) => {
  (0, _utils.validateConfig)({
    App,
    root,
    models,
    ...options
  }); // useful for debug

  const ReduxProvider = options && options.Provider || _reactRedux.Provider;
  const domRender = options && options.render || _reactDom.default.render;
  const {
    store,
    updateReducer,
    updateSaga,
    updateModels
  } = (0, _configureStore.default)(models, options);

  const render = Component => {
    domRender(_react.default.createElement(ReduxProvider, {
      store: store
    }, _react.default.createElement(Component, null)), root);
  };

  render(App);
  return {
    updateApp: render,
    updateModels,
    updateReducer,
    updateSaga
  };
};

var _default = start;
exports.default = _default;