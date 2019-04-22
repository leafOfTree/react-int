# react-int

A simple way to use [react][0] with [react-redux][1] and [redux-saga][2]. Keep most things in one file(model) like [Dva][3].

## Feature

- Reducers and sagas in one file.
- Namespace.
- Key as action type. (Convenient)
- HMR everywhere. (Need extra code snippets)
- Promisified dispatch.
- Handles Effect errors without terminating app.
- Works with [create-react-app][4].

## How it works

react-int is an encapsulation of react-redux and redux-saga, aiming to simplify code and related files. Its main job is to create store from models and render app.

## Install

    yarn add react-redux redux-saga react-int

    # or 
    npm i --save react-redux redux-saga react-int

## Usage

Start app, write models and connect components. That's all.

```javascript
import start from "react-int";
import models from "./models";
import App from "./App";

const { updateApp, updateModels } = start(
  App,
  document.getElementById("root"),
  models,
  {/* options */},
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

- Full online demo: [![Edit react-int-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/61wpmyj04r?fontsize=14)

- <a href="#/quick_start">Quick start</a>

- <a href="#/apis">APIs</a>

[0]: https://github.com/facebook/react
[1]: https://github.com/reduxjs/react-redux
[2]: https://github.com/redux-saga/redux-saga
[3]: https://github.com/dvajs/dva
[4]: https://github.com/facebook/create-react-app
