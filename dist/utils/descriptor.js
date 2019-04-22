"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelDescriptor = exports.configDescriptor = void 0;
const configDescriptor = {
  App: {
    required: true,
    description: 'App component to be rendered',
    type: Function,
    typeInfo: 'React Component class or function'
  },
  root: {
    required: true,
    description: 'DOM container to render into',
    type: HTMLElement,
    typeInfo: 'HTMLElement'
  },
  models: {
    required: true,
    description: 'Models user defines. The element structor is { namespace, state, reducers, effects, init }',
    type: Array,
    typeInfo: 'Array'
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
exports.configDescriptor = configDescriptor;
const modelDescriptor = {
  namespace: {
    reuired: true,
    description: 'Identity',
    type: String,
    typeInfo: 'string'
  },
  state: {
    required: true,
    description: 'Initial state',
    type: Object,
    typeInfo: 'Object'
  },
  reducers: {
    type: Object,
    typeInfo: 'Object',
    propType: Function,
    propTypeInfo: 'Function'
  },
  effects: {
    type: Object,
    typeInfo: 'Object',
    propType: Function,
    propTypeInfo: 'GeneratorFunction'
  },
  latests: {
    type: Object,
    typeInfo: 'Object',
    propType: Function,
    propTypeInfo: 'GeneratorFunction'
  },
  leadings: {
    type: Object,
    typeInfo: 'Object',
    propType: Function,
    propTypeInfo: 'GeneratorFunction'
  },
  sagas: {
    type: Object,
    typeInfo: 'Object',
    propType: Function,
    propTypeInfo: 'GeneratorFunction'
  },
  init: {
    type: Function,
    typeInfo: 'Function'
  }
};
exports.modelDescriptor = modelDescriptor;