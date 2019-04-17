import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import getReducers from '../src/getReducers';
import getRootSaga from '../src/getRootSaga';
import sagaManager from '../src/sagaManager';
import middleware from '../src/middleware';
import { models, mockCount } from './data';

const reducer = getReducers(models);
const sagaMiddlware = createSagaMiddleware();
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddlware, middleware),
);

describe('model effects', () => {
  test('watcher saga', () => {
    const rootSaga = getRootSaga(models);
    const gen = rootSaga();
    const state = store.getState();

    expect(getActionType(gen.next().value)).toEqual(
      getActionType(takeEvery('test/fetch', function* () {}))
    )
    expect(getActionType(gen.next().value)).toEqual(
      getActionType(takeEvery('test/save', function* () {}))
    )
  });

  test('worker saga', () => {
    sagaManager.startSagas(sagaMiddlware, models);

    store.dispatch({
      type: 'test/save'
    });
    store.dispatch({
      type: 'test/save'
    });

    const state = store.getState();
    expect(state.test.count).toBe(2);
  })

  test('saga action returns promise when dispatched', async () => {
    sagaManager.startSagas(sagaMiddlware, models);

    const result = await store.dispatch({
      type: 'test/fetch'
    });

    expect(result).toBe('fetch return value');
  })
})

function getActionType(value) {
  return value.payload.args[0];
}
