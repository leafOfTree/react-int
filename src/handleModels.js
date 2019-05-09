const dispatchWithNamespace = (dispatch, namespace) => action => {
  if (action.type.indexOf('/') === -1) {
    action.type = `${namespace}/${action.type}`;
  }
  dispatch(action);
};

const prevModels = {};

const handleModels = (models, store, options) => {
  const { onError } = options;

  models.forEach(model => {
    const { namespace, init } = model;

    if (init) {
      const prev = prevModels[namespace];
      // Recall init only when init is changed
      const isSameInit = prev && prev.init
        && prev.init.toString() === init.toString();
      if (!isSameInit) {
        const dispatch = dispatchWithNamespace(store.dispatch, namespace);
        init(dispatch, onError);
      }

      if (prev) {
        prevModels[namespace].init = init;
      } else {
        prevModels[namespace] = { init };
      }
    }
  })
}

export default handleModels;
