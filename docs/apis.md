# APIs

## start(App, root, models, options?) => Object

`start` function renders App and creates store.

## start parameters

- `App: Class | Function` The root App component to be rendered

- `root: HTMLElement` The root HTML element to render into

- `models: Array` See details below

- `options?: Object` See details below

## Models

- `models: Array` Objects with reducers and effects which mainly handle data logic

    model properties are

    - `namespace: String` An identify to shape state to small ones with the namespace as key. `namespace` should be prefixed to action type as `namespace/type` in `dispatch` and `put`. If `dispatch` or `put` is provided by `react-int` function argument, prefix can be omitted.

    - `state: Object` An object to initial model state
    - `reducers?: Object` Key is the action type, and value is the reducer function.
    - `effects?: Object` Key is the action type, and value is the worker saga. The watcher saga treat these effects in `takeEvery` way.
    - `latests?: Object` Same as `effects` but in `takeLatest` way.
    - `leadings?: Object` Same as `effects` but in `takeLeading` way.
    - `sagas?: Object` Write watcher sagas and take full advantage of redux-saga.
    - `init?: (dispatch: (action: Object), onError: (error: Error))` If provided, it will be called on model initial.

### Models Example

You can omit `namespace` prefix when using `put` from argument.

```javascript
// model
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default [
  {
    namespace: 'app',
    state: {
      count: 0,
    },
    reducers: {
      update: (state, action) => {
        return {
          ...state,
          ...action.payload,
        };
      },
    },
    effects: {
      *increaseAsync(action, { call, put, select }) {
        yield call(delay, 1000);

        const count = yield select(state => state.app.count);
        yield put({
          type: 'update',
          payload: {
            count: count + 1,
          }
        });
      },
    }
  }, 
  // require('./path/to/model').default, 
];
```

### Models Example in Saga Way

`namespace` should be prefixed to action type when using origin `put` from `redux-saga/effects`.

```javascript
// model
 
import { call, put, select } from 'redux-saga/effects';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//...
  effects: {
    *increaseTwoAsync(action) {
      yield put({
        type: 'app/update',
        payload: { loading: true },
      });
      yield call(delay, 1000);
      yield put({
        type: 'app/update',
        payload: { loading: false },
      });
  
      const count = yield select(state => state.app.count);
      yield put({
        type: 'app/update',
        payload: {
          count: count + 2,
        }
      });
    }
  }
```

## Options

- `options?: Object` A list of optional options, currently supported options are

    - `onError: (error: Error)` If provided, it will be called with uncaught errors from Sagas. Userful for handling exceptions globally

    - `dispatchError: Boolean` If enabled, it allows your to catch every single saga error by `dispatch(action).catch()`. Won't work if `onError` is provided
    - `initialState: Object` Initial state to be passed to createStore and has to be with same shape as reducers
    - `onStateChange: (state)` State change listener. Always called after action is dispatched
    - `render` Pass ReactDOM.render for debug
    - `Provider` Pass react-redux's Provider for debug

### Options Example

```javascript
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

const { updateApp, updateModels } = start(
  App,
  document.getElementById('root'),
  models,
  {
    onError: e => {
      console.error('onError', e);
    },
    initialState: {
      loadLocalState();
    },
    onStateChange: state => {
      saveLocalState(state);
    },
    dispatchError: true,     // won't work if onError is provided
    Provider,                // debug
    render: ReactDOM.render, // debug
  }
);
```

## start return

`start` function is expected to return an object with `updateApp`, `updateModels` methods. They can be used to enable HMR.

- `updateApp: ()`

- `updateModels: ()`

#### Example

```javascript
const { updateApp, updateModels } = start(
  App,
  document.getElementById('root'),
  models,
  {/* options */},
);

// enable HMR
if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept('./App', () => {
    updateApp(App);
  });

  module.hot.accept('./models', () => {
    updateModels(models);
  });
}
```
