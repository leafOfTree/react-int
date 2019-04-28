# APIs

## start: (App, root, models, options?) => Object

`start` function renders App and creates store.

## start parameters

- `App: Class | Function` The root App component to be rendered

- `root: HTMLElement` The root HTML element to render into

- `models: Array` See details below

- `options?: Object` See details below

## Models

- `models: Array` Objects with reducers and effects which mainly handle data logic

    model properties are

    - `namespace: String` An identify which is used as key to shape state to small ones. It should be prefixed to action type as `namespace/type` in `dispatch` and `put`. If `dispatch` or `put` is provided by `react-int` function argument, the prefix can be omitted.

    - `state: Object` An object to initial model state.
    - `reducers?: Object`
        - `key` Action type.
        - `value: (state: Object, action: Object) => newState: Object` Reducer function.

    - `effects?: Object` A container of worker sagas. This is different from the redux-saga effects.
    
        - `key` Action type.
        - `value: (action: Object, effectCreators: Object)` Worker saga. The watcher sagas treat these in `takeEvery` way. `effectCreators`'s properties are `call`, `put` and `select`.

    - `latests?: Object` Same as `effects` but in `takeLatest` way.
    - `leadings?: Object` Same as `effects` but in `takeLeading` way.
    - `sagas?: Object` Write watcher and worker sagas and take full advantage of redux-saga.
    - `init?: (dispatch: (action: Object), onError: (error: Error))` If provided, it will be called on model initial.

### Models Example

`namespace` prefix can be omitted when using `put` from argument.

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

It is possible to build complex control flow by `take` and `put`. See [redux-saga: Pulling future actions][0] for more details.

```javascript
// model
import { call, put, select } from 'redux-saga/effects';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//...
  effects: {
    *increaseTwoAsync(action) {
      yield call(delay, 1000);
  
      const count = yield select(state => state.app.count);
      yield put({
        type: 'app/update',
        payload: {
          count: count + 2,
        }
      });
    }
  },
  sagas: {
    *watchAndLog() {
      while(true) {
        const action = yield take('*');
        const state = yield select();

        console.log('action', action);
        console.log('state after', state);
      }
    },
    *loginFlow() {
      while(true) {
        yield take('app/login');
        // ... perfom the login logic

        yield take('app/logout');
        // ... perform the logout logic
      }
    },
  },
  
```

## Options

- `options?: Object` A list of optional options. Currently supported options are

    - `onError: (error: Error)` If provided, it will be called with uncaught errors from Sagas. Userful for handling exceptions globally

    - `dispatchError: Boolean` If enabled, it allows your to catch each saga error by `dispatch().catch()`. It won't work if `onError` is provided
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
    initialState: loadLocalState(), 
    onStateChange: state => {
      saveLocalState(state);
    },
    dispatchError: true,     // won't work if onError is provided
    Provider,                // for debug
    render: ReactDOM.render, // for debug
  }
);
```

## start return

`start` function is expected to return an object with `updateApp`, `updateModels` methods. They can be used to enable HMR.

- `updateApp: (App: Class | Function)`

- `updateModels: (models: Array)`

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

[0]: https://redux-saga.js.org/docs/advanced/FutureActions.html
