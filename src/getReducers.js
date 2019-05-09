import { combineReducers } from 'redux';

const getReducers = models => {
  const rootReducers = {};
  if (models.length) {
    models.forEach(model => {
      const { namespace, state, reducers } = model;
      const initState = state || {};

      rootReducers[namespace] = (state = initState, action) => {
        const type = action.type;
        if (type && type.indexOf(`${namespace}/`) === 0) {
          const key = type.replace(`${namespace}/`, '');
          const reducer = reducers[key];
          if (reducer) {
            return reducer(state, action);
          }
        }

        return state;
      }
    })
    return combineReducers(rootReducers);
  } else {
    return (state = {}) => state;
  }
}

export default getReducers;
