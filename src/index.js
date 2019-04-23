import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { validateConfig } from './utils';

const start = (App, root, models, options) => {
  validateConfig({ App, root, models, ...options });

  // useful for debug
  const ReduxProvider = (options && options.Provider) || Provider;
  const domRender = (options && options.render) || ReactDOM.render;

  const {
    store, updateReducer, updateSaga, updateModels,
  } = configureStore(models, options);

  const render = Component => {
    domRender(
      (<ReduxProvider store={store}>
        <Component />
      </ReduxProvider>),
      root
    );
  }

  render(App);

  return {
    updateApp: render,
    updateModels,
    updateReducer,
    updateSaga,
  };
}

export default start;
