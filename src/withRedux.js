import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { validateConfig } from './utils';

const withRedux = (App, models, options) => {
  validateConfig({ App, root: null, models, ...options });

  // useful for debug
  const ReduxProvider = (options && options.Provider) || Provider;

  const {
    store, updateReducer, updateSaga, updateModels,
  } = configureStore(models, options);

  const reduxApp = () => (
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  );

  return {
    reduxApp,
    updateModels,
    updateReducer,
    updateSaga,
  };
}

export default withRedux;
