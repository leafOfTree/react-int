# Usage with React Native

`react-int` works with React Native.

## Create project

[expo-cli][0] is a useful tool to manage React Native project.

    npm i -g expo-cli

    expo init

Choose 'blank' and input your project name like 'react-int-demo'.

## Install

    cd react-int-demo
    npm i react-redux@6.0.0 redux-saga react-int

**Note**: Currently react-redux version has to be fixed at `6.0.0` to work with react-native's React.

## Enhance App

High Order Component `withRedux` wil enhance app to be aware of redux. `connect` components to subscribe to the store.

Modify `./App.js`

```javascript
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import withRedux from 'react-int/withRedux';
import models from './models';

class App extends React.Component {
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

  increaseTwoAsync = () => {
    this.props.dispatch({
      type: "app/increaseTwoAsync"
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Count: {this.props.count}
        </Text>
        <Text>
          {this.props.loading ? 'Loading...' : <Text>&nbsp;</Text>}
        </Text>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button
              onPress={this.increase}
              title="Increase"
            />
          </View>
          <View style={styles.button}>
            <Button
              style={styles.button}
              onPress={this.increaseAsync}
              title="Increase Asyn"
            />
          </View>
          <View style={styles.button}>
            <Button
              style={styles.button}
              onPress={this.increaseTwoAsync}
              title="Increase Two Asyn"
            />
          </View>
        </View>
      </View>
      );
  }
}

const connectedApp = connect(state => ({
  ...state.app,
}))(App);

export default withRedux(connectedApp, models);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 5,
    marginRight: 5,
  }
});
```

## App models

Models are objects containing `reducers` and `effects`(worker sagas) which are separated by `namespace`. `state` is used for model's initial state.

Models can be defined in separated files and required to one arary.

Add `./models/index.js`

```javascript
import { call, put, select } from "redux-saga/effects";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default [
  {
    namespace: "app",
    state: {
      count: 0,
      loading: false
    },
    reducers: {
      update: (state, action) => {
        return {
          ...state,
          ...action.payload
        };
      }
    },
    effects: {
      *increaseAsync(action, { call, put, select }) {
        yield put({
          type: "update",
          payload: { loading: true }
        });
        yield call(delay, 500);
        yield put({
          type: "update",
          payload: { loading: false }
        });

        const count = yield select(state => state.app.count);
        yield put({
          type: "update",
          payload: {
            count: count + 1
          }
        });
      },
      *increaseTwoAsync(action) {
        yield put({
          type: "app/update",
          payload: { loading: true }
        });
        yield call(delay, 500);
        yield put({
          type: "app/update",
          payload: { loading: false }
        });

        const count = yield select(state => state.app.count);
        yield put({
          type: "app/update",
          payload: {
            count: count + 2
          }
        });
      }
    }
  }
];
```

## Result

After

    expo start

App like <https://expo.io/@leafvocation/React-int_for_React_Native>(scan the QR code with expo mobile app) should appear on the phone or simulator if everything goes well.

[0]: https://expo.io/@leafvocation/React-int_for_React_Native
