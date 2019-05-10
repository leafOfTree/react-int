# Quick Start

`react-int` works with [create-react-app][4] out of box.

**You'll need to have Node 8.10.0 or later on your local development machine.**

## Create project

    npm i -g create-react-app

    npx create-react-app react-int-demo 

## Install

    cd react-int-demo

    npm i react-redux redux-saga react-int

## Start app

Following operations are under the `src` directory.

    cd src

Replace `ReactDOM.render` with `start` method from `react-int` to start app. Extra code has to be added manully to enable `HMR` for compoents, reducers and sagas, which is very convenient for development.

Modify `index.js`

```javascript
import start from 'react-int';
import App from './App';
import models from './models';
import './index.css';

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

## Add models

Models are objects containing `reducers` and `effects`(worker sagas) which are separated by `namespace`. `state` is used for model's initial state.

Models can be defined in separated files and required to one arary.

Add `./models/index.js`

```javascript
export default [
  {
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

## Connecting Components

The original react-redux's [connect][5] is used to map state to component props.

`this.props.dispatch` is used to dispatch actions for reducers and effects.

Modify `./App.js`

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import logo from './logo.svg';

class App extends Component {
  increase = () => {
    this.props.dispatch({
      type: 'app/update',
      payload: {
        count: this.props.count + 1
      }
    });
  };

  increaseAsync = () => {
    this.props.dispatch({
      type: 'app/increaseAsync'
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
          <div>{this.props.loading && 'Loading...'}</div>
        </header>
      </div>
    );
  }
}

export default connect(state => ({
  ...state.app
}))(App);
```

## Result

After 

    npm start

<http://localhost:3000> should look like <https://csb-61wpmyj04r.netlify.com/> if everything goes well.

[0]: https://github.com/facebook/react
[1]: https://github.com/reduxjs/react-redux
[2]: https://github.com/redux-saga/redux-saga
[3]: https://github.com/dvajs/dva
[4]: https://github.com/facebook/create-react-app
[5]: https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md
