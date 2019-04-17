"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validModels = exports.validConfig = void 0;

var _react = _interopRequireDefault(require("react"));

var _configDescriptor = _interopRequireDefault(require("./configDescriptor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validConfigKey = (key, value) => {
  const descriptor = _configDescriptor.default[key];
  const {
    type,
    typeInfo
  } = descriptor;
  let valid;

  if (key === 'App') {
    valid = value instanceof type || value.type && value.type.name === 'ConnectFunction';
  } else {
    valid = value instanceof type || typeof value === typeInfo;
  }

  if (!valid) {
    throw new Error(`${key} type should be ${typeInfo}, but got ${typeof value}.`);
  }
};

const validConfig = config => {
  for (let key in config) {
    if (!_configDescriptor.default[key]) {
      throw new Error(`Unrecognised key: ${key}`);
    }
  }

  for (let key in _configDescriptor.default) {
    if (_configDescriptor.default[key].required && config[key] === undefined) {
      throw new Error(`Missing argument: ${key}`);
    }
  }

  for (let key in config) {
    validConfigKey(key, config[key]);
  }
};

exports.validConfig = validConfig;

const validModels = models => {
  models.forEach(model => {
    const {
      namespace,
      state,
      reducers,
      effects,
      init
    } = model;

    if (!namespace) {
      throw new Error('model.namespace is required');
    }

    if (reducers) {
      if (!reducers instanceof Object) {
        throw new Error('model.reducers type should be Object');
      }

      for (let p in reducers) {
        if (!(reducers[p] instanceof Function)) {
          throw new Error('model.reducers value type should be Function');
        }
      }
    }

    if (effects) {
      if (!effects instanceof Object) {
        throw new Error('model.effects value type should be Object');
      }

      for (let p in effects) {
        if (!(effects[p] instanceof Function)) {
          throw new Error('model.effects value type should be Function/Generator');
        }
      }
    }

    if (init && !(init instanceof Function)) {
      throw new Error('init value type should be Function');
    }
  });
};

exports.validModels = validModels;