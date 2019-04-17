import configureStore from '../src/configureStore';
import { models, options, mockCount } from './data';

const { store } = configureStore(models, options);

describe('configureStore', () => {
  test('options initialState', () => {
    const state = store.getState();
    expect(state).toEqual(mockCount(10));
  })
})
