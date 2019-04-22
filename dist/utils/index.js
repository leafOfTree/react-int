"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validModels = exports.validConfig = void 0;

var _react = _interopRequireDefault(require("react"));

var _descriptor = require("./descriptor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isMatchType = (value, type, typeInfo) => {
  return value instanceof type || typeof value === typeInfo;
};

const validConfigKey = (key, value) => {
  const descriptor = _descriptor.configDescriptor[key];
  const {
    type,
    typeInfo
  } = descriptor;
  let valid;

  if (key === 'App') {
    valid = value instanceof type || value.type && value.type.name === 'ConnectFunction';
  } else {
    valid = isMatchType(value, type, typeInfo);
  }

  if (!valid) {
    throw new Error(`${key} type should be ${typeInfo}, but got ${typeof value}.`);
  }
};

const validModelKey = (key, value) => {
  const descriptor = _descriptor.modelDescriptor[key];
  const {
    type,
    typeInfo,
    propType,
    propTypeInfo
  } = descriptor;

  if (!isMatchType(value, type, typeInfo)) {
    throw new Error(`Model.${key} type should be ${typeInfo}, but got ${typeof value}.`);
  }

  if (propType) {
    for (let p in value) {
      if (!isMatchType(value[p], propType, propTypeInfo)) {
        throw new Error(`Model.${key} prop '${p}' type should be ${propTypeInfo}, but got ${typeof value[p]}.`);
      }
    }
  }
};

const validConfig = config => {
  for (let key in config) {
    if (!_descriptor.configDescriptor[key]) {
      throw new Error(`Unrecognised key: ${key}`);
    }
  }

  for (let key in _descriptor.configDescriptor) {
    if (_descriptor.configDescriptor[key].required && config[key] === undefined) {
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
      throw new Error('Model.namespace is required');
    }

    for (let key in _descriptor.modelDescriptor) {
      if (_descriptor.modelDescriptor[key].required && model[key] === undefined) {
        throw new Error(`Model ${namespace} has missing key: ${key}`);
      }
    }

    for (let key in model) {
      if (!_descriptor.modelDescriptor[key]) {
        throw new Error(`Model ${namespace} has unrecognized key: ${key}`);
      }
    }

    for (let key in model) {
      validModelKey(key, model[key]);
    }
  });
};

exports.validModels = validModels;