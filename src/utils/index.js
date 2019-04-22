import React from 'react';
import { configDescriptor, modelDescriptor } from './descriptor';

const isMatchType = (value, type, typeInfo) => {
  return (value instanceof type) || (typeof value === typeInfo);
}

const validConfigKey = (key, value) => {
  const descriptor = configDescriptor[key];
  const { type, typeInfo } = descriptor;

  let valid;
  if (key === 'App') {
    valid = value instanceof type
      || (value.type && value.type.name === 'ConnectFunction')
  } else {
    valid = isMatchType(value, type, typeInfo);
  }

  if (!valid) {
    throw new Error(
      `${key} type should be ${typeInfo}, but got ${typeof value}.`
    );
  }
}

const validModelKey = (key, value) => {
  const descriptor = modelDescriptor[key];
  const { type, typeInfo, propType, propTypeInfo } = descriptor;

  if (!isMatchType(value, type, typeInfo)) {
    throw new Error(
      `Model.${key} type should be ${typeInfo}, but got ${typeof value}.`
    );
  }

  if (propType) {
    for (let p in value) {
      if (!isMatchType(value[p], propType, propTypeInfo)) {
        throw new Error(
          `Model.${key} prop '${p}' type should be ${propTypeInfo}, but got ${typeof value[p]}.`
        );
      }
    }
  }
}

export const validConfig = config => {
  for (let key in config) {
    if (!configDescriptor[key]) {
      throw new Error(`Unrecognised key: ${key}`);
    }
  }

  for (let key in configDescriptor) {
    if (configDescriptor[key].required && config[key] === undefined) {
      throw new Error(`Missing argument: ${key}`);
    }
  }

  for (let key in config) {
    validConfigKey(key, config[key]);
  }
}

export const validModels = models => {
  models.forEach(model => {
    const { namespace, state, reducers, effects, init } = model;

    if (!namespace) {
      throw new Error('Model.namespace is required');
    }

    for (let key in modelDescriptor) {
      if (modelDescriptor[key].required && model[key] === undefined) {
        throw new Error(`Model ${namespace} has missing key: ${key}`);
      }
    }

    for (let key in model) {
      if (!modelDescriptor[key]) {
        throw new Error(`Model ${namespace} has unrecognized key: ${key}`);
      }
    }

    for (let key in model) {
      validModelKey(key, model[key]);
    }
  })
}
