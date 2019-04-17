# react-teamwork

A simple way to use [react][0] with [react-redux][1], [redux-saga][2]. Keep most things in one file(called model) like [Dva][3].

## Feature

- Reducers and sagas in one file.
- Namespace for state.
- Key as action types. (Convenient)
- HMR everywhere. (need extra code snippets)
- works with [create-react-app][4].

## How it works

react-teamwork is a combination and encapsulation of react-redux and redux-saga, aiming to simplify code and related files.

## Install

    npm i --save react-teamwork

## Usage with create-react-app

[![Edit react-teamwork-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/61wpmyj04r?fontsize=14)

Init a demo project

    create-react-app react-teamwork-demo
    
    cd react-teamwork-demo/src

Modify entry`./index.js`

```diff
-  import React from 'react';
-  import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

+  import start from 'react-teamwork';
+  import models from './models';
+  
+  const { updateApp, updateModels } = start(App, document.getElementById('root'), models);
+  
+  // enable HMR
+  if (module.hot && process.env.NODE_ENV !== 'production') {
+    module.hot.accept('./App', () => {
+      updateApp(App);
+    })
+  
+    module.hot.accept('./models', () => {
+      updateModels(models);
+    })
+  }
-  ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

Add `./models/index.js`

```javascript
export const models = [{
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
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      yield call(delay, 1000);

      const count = yield select(state => state.app.count);
      yield put({
        type: 'update',
        payload: {
          count: ++count,
        }
      });
    }
  }
}];
```

Modify `./App.js`

```diff
import React, { Component } from 'react';
+import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';

class App extends Component {
+ increaseAsync = () => {
+   this.props.dispatch({
+     type: 'app/increaseAsync',
+   })
+ }
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
+         <button onClick={this.increaseAsync}>Click</button>
+         <div>Count: {this.props.count}</div>
        </header>
      </div>
    );
  }
}

-export default App;
+export default connect(state => ({
+  ...state.app,
+}))(App);
```


[0]: https://github.com/facebook/react
[1]: https://github.com/reduxjs/react-redux
[2]: https://github.com/redux-saga/redux-saga
[3]: https://github.com/dvajs/dva
[4]: https://github.com/facebook/create-react-app
