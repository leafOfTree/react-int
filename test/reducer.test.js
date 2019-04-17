import { createStore, applyMiddleware } from 'redux';
import getReducers from '../src/getReducers';
import getRootSaga from '../src/getRootSaga';
import { models, mockCount } from './data';

const reducer = getReducers(models);
const store = createStore(reducer);

describe('model reducers', () => {
  test('initial state', () => {
    const state = store.getState();
    expect(state).toEqual(mockCount(0));
  });

  test('dispatch "test/updateValue"', () => {
    store.dispatch({
      type: 'test/increase',
    });
    const state = store.getState();
    expect(state).toEqual(mockCount(1));
  });
})
