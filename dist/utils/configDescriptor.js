"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const configDescriptor = {
  App: {
    description: 'App component to be rendered',
    type: Function,
    typeInfo: 'React Component class or function',
    required: true
  },
  root: {
    description: 'DOM container to render into',
    type: HTMLElement,
    typeInfo: 'HTMLElement',
    required: true
  },
  models: {
    description: 'Models user defines. The element structor is { namespace, state, reducers, effects, init }',
    type: Array,
    typeInfo: 'Array',
    required: true
  },
  Provider: {
    description: 'Provider from react-redux which is useful for debug',
    type: Function,
    typeInfo: 'Function'
  },
  render: {
    description: 'render method from reactDOM which is useful for debug',
    type: Function,
    typeInfo: 'Function'
  },
  onError: {
    description: 'Common error handler for exceptions in effects/init',
    type: Function,
    typeInfo: 'Function'
  },
  dispatchError: {
    description: `Flag that indicates to use dispatch.catch
      to handle exceptions in effects`,
    type: Boolean,
    typeInfo: 'boolean'
  },
  initialState: {
    description: 'initial state passed to createStore with same shape as reducers',
    type: Object,
    typeInfo: 'Object'
  },
  onStateChange: {
    description: 'state listener, called after dispatching action',
    type: Function,
    typeInfo: 'Function'
  }
};
var _default = configDescriptor;
exports.default = _default;