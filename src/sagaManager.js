import { take, fork, cancel } from 'redux-saga/effects';
import getRootSaga from './getRootSaga';

function createCancelableSaga(saga) {
  if (process.env.NODE_ENV === 'production') {
    return saga;
  } else {
    return function* () {
      const sagaTask = yield fork(saga);

      yield take(CANCEL_SAGAS_HMR);
      yield cancel(sagaTask);
    };
  }
}

const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR';

const sagaManager = {
  startSagas(sagaMiddleware, models, options) {
    const saga = createCancelableSaga(getRootSaga(models, options));
    sagaMiddleware.run(saga);
  },

  cancelSagas(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR,
    });
  }
}

export default sagaManager;
