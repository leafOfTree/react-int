import configureStore from '../src/configureStore';
import { validateConfig } from '../src/utils';
import {
  models, invalidModels, options, conflictOptions, mockCount,
} from './data';

describe('assert config, models', () => {
  test('assert valid model', () => {
    const { store } = configureStore(models, options);
  })

  test('assert conflict options', () => {
    try {
      validateConfig(conflictOptions);
    } catch (e) {
      expect(e).toEqual(new Error('Conflict options, only one can be enabled: onError, dispatchError'));
    }
  })

  test('assert model missing key', () => {
    try {
      const { store } = configureStore(invalidModels.emptyNamespace);
    } catch (e) {
      expect(e).toEqual(new Error('Model.namespace is required'));
    }

    try {
      const { store } = configureStore(invalidModels.noState);
    } catch (e) {
      expect(e).toEqual(new Error('Model test has missing key: state'));
    }
  })

  test('assert model prop', () => {
    try {
      const { store } = configureStore(invalidModels.invalidReducers);
    } catch (e) {
      expect(e).toEqual(new Error(`Model.reducers prop 'count' type should be Function, but got number.`));
    }

    try {
      const { store } = configureStore(invalidModels.invalidEffects);
    } catch (e) {
      expect(e).toEqual(new Error(`Model.effects prop 'count' type should be GeneratorFunction, but got number.`));
    }

    try {
      const { store } = configureStore(invalidModels.invalidLatests);
    } catch (e) {
      expect(e).toEqual(new Error(`Model.latests prop 'count' type should be GeneratorFunction, but got number.`));
    }

    try {
      const { store } = configureStore(invalidModels.invalidLeadings);
    } catch (e) {
      expect(e).toEqual(new Error(`Model.leadings prop 'count' type should be GeneratorFunction, but got number.`));
    }

    try {
      const { store } = configureStore(invalidModels.invalidSagas);
    } catch (e) {
      expect(e).toEqual(new Error(`Model.sagas prop 'count' type should be GeneratorFunction, but got number.`));
    }

    try {
      const { store } = configureStore(invalidModels.invalidInit);
    } catch (e) {
      expect(e).toEqual(new Error('Model.init type should be Function, but got object.'));
    }

    try {
      const { store } = configureStore(invalidModels.dumplicateNamespace);
    } catch (e) {
      expect(e).toEqual(new Error("Model.namespace should be unique, but found dumplicate 'test'"));
    }
  })
})
