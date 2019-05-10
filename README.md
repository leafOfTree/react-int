<h1 align="center">
  React-Int(egrity)
</h1>

<p align="center">
  <a href="https://travis-ci.com/leafOfTree/react-int">
      <img src="https://travis-ci.com/leafOfTree/react-int.svg?token=2kNWVmnjedaFy64rtqzp&branch=master" />
  </a>
</p>

A simple way to use [React][0]/[React Native][5] with [react-redux][1] and [redux-saga][2]. Keep most things in one file(model) like [Dva][3].

## Feature

- Reducers and sagas in one file.
- Namespace.
- Key as action type. (Convenient)
- HMR everywhere. (Need extra code snippet)
- Promisified dispatch.
- Handles Effect errors without terminating app.
- [Support React Native][8].
- Works with [create-react-app][4].

Feel free to make an issue or a pull request.

## How it works

react-int is an encapsulation of react-redux and redux-saga, aiming to simplify code and related files. Its main job is to create store from models and render app.

## Install

    yarn add react-redux redux-saga react-int

    # or 
    npm i react-redux redux-saga react-int

## Usage

Start app, write models and connect components. That's all. :tada:

```javascript
// index.js
import start from "react-int";
import App from "./App";
import models from "./models";

const { updateApp, updateModels } = start(
  App,
  document.getElementById("root"),
  models,
  {/* options */},
);

// enable HMR
if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept('./App', () => updateApp(App));
  module.hot.accept('./models', () => updateModels(models));
}
```

See also

- Full online demo: [![Edit react-int-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/61wpmyj04r?fontsize=14)

- [Quick start][6]

- [APIs][7]

## Usage with React Native

See [Usage with React Native][8]

## Data Flow
                                                          --Model-- 
           defines       triggers             sync       |         |   updates
    State ----------> UI ----------> Actions ----------> | Reducer | ----------> Store
      ^                                 |                |         |               |
      |                                 |     async      |         |               |
      |                                 |--------------->|  Saga   |               |
      |                                 |<---------------|         |               |
      |                                       puts        ---------                |
      |                                                                            |
       ----------------------------------------------------------------------------
                                    contains


## Documentation

Basic introduction can be found on [the website](https://leafoftree.github.io/react-int).

Refer to [react][0], [react-redux][1], [redux-saga][2] for further documentation.

## Development

See <a href="https://leafoftree.github.io/react-int/#/development">Development</a>.

[0]: https://github.com/facebook/react
[1]: https://github.com/reduxjs/react-redux
[2]: https://github.com/redux-saga/redux-saga
[3]: https://github.com/dvajs/dva
[4]: https://github.com/facebook/create-react-app
[5]: https://github.com/leafOfTree/react-native
[6]: https://leafoftree.github.io/react-int/#/quick_start
[7]: https://leafoftree.github.io/react-int/#/apis
[8]: https://leafoftree.github.io/react-int/#/usage_with_react_native
