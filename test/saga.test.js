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

sagaManager.startSagas(sagaMiddlware, models);

describe('model', () => {
  test('watcher saga', () => {
    const rootSaga = getRootSaga(models);
    const gen = rootSaga();

    expect(getActionType(gen.next().value)).toEqual(
      getActionType(takeEvery('test/fetch', function* () {}))
    )
    expect(getActionType(gen.next().value)).toEqual(
      getActionType(takeEvery('test/increaseAsync', function* () {}))
    )
  });

  test('effects', async () => {
    await store.dispatch({
      type: 'test/increaseAsync'
    });
    await store.dispatch({
      type: 'test/increaseAsync'
    });

    const state = store.getState();
    expect(state).toEqual(mockCount(2));
  })

  test('leadings', async () => {
    await Promise.race([
      store.dispatch({
        type: 'test/increaseTwoAsync'
      }),
      store.dispatch({
        type: 'test/increaseTwoAsync'
      })
    ])

    const state = store.getState();
    expect(state).toEqual(mockCount(4));
  })

  test('latests', () => {
    expect.assertions(1);

    store.dispatch({
      type: 'test/increaseThreeAsync'
    }).then(result => {});

    return store.dispatch({
      type: 'test/increaseThreeAsync'
    }).then(result => {
      const state = store.getState();
      expect(state).toEqual(mockCount(7));
    });
  })

  test('saga action returns promise when dispatched', async () => {
    const result = await store.dispatch({
      type: 'test/fetch'
    });

    expect(result).toBe('fetch return value');
  })
})

function getActionType(value) {
  return value.payload.args[0];
}
