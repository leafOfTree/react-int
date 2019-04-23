# External APIs

## connect()

The `connect()` function connects a React component to a Redux store.

`connect: (mapStateToProps?, ...) => (Component) => WrapperComponent`

- mapStateToProps: (state, ownProps?) => Object 

    Any time the store is updated, `mapStateToProps` will be called and given the store state as the only parameter. The result of `mapStateToProps` must be a plain object, which will be merged into the wrapped component's props.

See [React Redux connect()][0] for details.

### Example

The connected component `connect(mapStateToProp)(App)` will subscribe to Redux store. Its `name` prop will update when `state.app.name` is updated.

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <div>App: {this.props.name}</div>
    );
  }
}

const mapStateToProp = state => {
  return { 
    name: state.app.name 
  };
};

export default connect(mapStateToProp)(App);
```

## store.dispatch()

`dispatch: (action: Object) => Promise` Dispatches an action. This is the only way to trigger a state change.

The store's reducing function will be called with the current `state` and the given `action` synchronously.

> `put(action)` will finally trigger `dispatch(action)`.

## action

`action: Object` A plain object describing the change to store.

- `type: String`:  By convenience, the `type` is used to trigger corresponding reducer function.

See [Redux dispatch(action)][1] for details.

## effects

In `redux-saga`, Sagas are implemented using Generator function. To express the Saga logic, we yield plain JavaScript Objects from the Generator. We call those objects as Effects. An [effect][3] is an object that contains some information to be interpreted by the middleware.

**Vocabulory**

the middleware: the redux-saga middleware

blocking: the Generator is suspended

See [Redux Saga API Reference][2] for details.

## call()

`call(fn, ...args?)` Creates an Effect description that instructs the middleware to call the function `fn` with `args` as arguments. This effect is `blocking` until `fn` finishes.

- `fn: Function` A Generator function, or normal function which either returns a Promise or any other value

    If `fn` is a Generator function which returns an Iterator object or a normal function which returns a Promise, the middleware will suspend the current Generator until value is returned/resolved or some error is thrown. Else, the result is returned immediately and the current Generator runs synchronously.

- `args?: any` Optional arguments(`arg1, arg2, ...`) to be passed  to `fn`

## put()

`put(action)` Creates an Effect description that instructs the middleware to dispatch an action to the Store. This effect is `non-blocking`.

## select()

`select(selector?, ...args?)` Creates an Effect description that instructs the middleware to invoke selecotr on the current state. This effect is `non-blocking`.

- `selector?: (state, ...args) => sliceOfState` It takes the current state and optionally some arguments and returns a slice of the state.

- `args?: any` Optional arguments(`arg1, arg2, ...`) to be passed  to `selector`

If no argument is provided, `yield select()` will be resolved with the entire state(`getState()`)

## take()

`take(pattern?)`: Creates an Effect description that instructs the middleware to wait for a specific action on the Store. This effect is `blocking` until an action that matches `pattern` is dispatched.

- `pattern: empty |'*'| (action) => Boolean | String | Array` It is interpreted using different rules on specific type.


[0]: https://react-redux.js.org/api/connect
[1]: https://redux.js.org/api/store#a-id-dispatch-class-anchor-a-dispatchaction-dispatch
[2]: https://redux-saga.js.org/docs/api/
[3]: https://redux-saga.js.org/docs/api/#effect-creators
