# react-int

A simple way to use [react][0] with [react-redux][1], [redux-saga][2]. Keep most things in one file(model) like [Dva][3].

## Feature

- Reducers and sagas in one file.
- Namespace for state.
- Key as action types. (Convenient)
- HMR everywhere. (need extra code snippets)
- works with [create-react-app][4].

## How it works

react-int is an encapsulation of react-redux and redux-saga, aiming to simplify code and related files.

## Install

    npm i --save react-int

## Usage with create-react-app

Usage with create-react-app: [![Edit react-int-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/61wpmyj04r?fontsize=14)

See [Quick start]()

Init a demo project

    create-react-app react-int-demo
    
    cd react-int-demo/src

Change entry`./index.js`

```javascript
import start from "react-int";
import App from "./App";
import "./index.css";
import models from "./models";

const { updateApp, updateModels } = start(
  App,
  document.getElementById("root"),
  models,
);

// enable HMR
if (module.hot && process.env.NODE_ENV !== "production") {
  module.hot.accept("./App", () => {
    updateApp(App);
  });

  module.hot.accept("./models", () => {
    updateModels(models);
  });
}
```

Add `./models/index.js`

```javascript
export default [{
  namespace: 'app',
  state: {
    count: 0,
    loading: false,
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
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      yield put({
        type: 'update',
        payload: { loading: true },
      });
      yield call(delay, 1000);
      yield put({
        type: 'update',
        payload: { loading: false },
      });

      const count = yield select(state => state.app.count);
      yield put({
        type: 'update',
        payload: {
          count: count + 1,
        }
      });
    }
  }
}, 
  // require('./path/to/model').default, 
];
```

Change `./App.js`

```javascript
import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import logo from "./logo.svg";

class App extends Component {
  increase = () => {
    this.props.dispatch({
      type: "app/update",
      payload: {
        count: this.props.count + 1
      }
    });
  };

  increaseAsync = () => {
    this.props.dispatch({
      type: "app/increaseAsync"
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div>
            <button onClick={this.increase}>Increase</button>
            <span> </span>
            <button onClick={this.increaseAsync}>Increase Async</button>
          </div>
          <div>Count: {this.props.count}</div>
          <div>{this.props.loading && "Loading..."}</div>
        </header>
      </div>
    );
  }
}

export default connect(state => ({
  ...state.app
}))(App);
```

[0]: https://github.com/facebook/react
[1]: https://github.com/reduxjs/react-redux
[2]: https://github.com/redux-saga/redux-saga
[3]: https://github.com/dvajs/dva
[4]: https://github.com/facebook/create-react-app
