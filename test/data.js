export const models = [{
  namespace: 'test',
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
    increase: (state, action) => {
      return {
        ...state,
        count: ++state.count,
      };
    }
  },
  effects: {
    *fetch(action, { call, put, select }) {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      const params = action.payload ? action.payload.params : 10;
      yield call(delay, params);
      return 'fetch return value';
    },
    *save(action, { call, put, select }) {
      const state = yield select(state => state.test);
      yield put({
        type: 'update',
        payload: {
          count: ++state.count,
        }
      });
    }
  },
}];

export const invalidModels = {
  emptyNamespace: [
    {
      namespace: '',
      state: {},
    }
  ],
  noState: [
    {
      namespace: 'test',
    }
  ],
  invalidReducers: [
    {
      namespace: 'test',
      state: {},
      reducers: {
        count: 1,
      },
    },
  ],
  invalidEffects: [
    {
      namespace: 'test',
      state: {},
      effects: {
        count: 1,
      },
    },
  ],
  invalidLatests: [
    {
      namespace: 'test',
      state: {},
      latests: {
        count: 1,
      },
    },
  ],
  invalidLeadings: [
    {
      namespace: 'test',
      state: {},
      leadings: {
        count: 1,
      },
    },
  ],
  invalidSagas: [
    {
      namespace: 'test',
      state: {},
      sagas: {
        count: 1,
      },
    },
  ],
  invalidInit: [
    {
      namespace: 'test',
      state: {},
      init: {},
    },
  ],
}

export const options = {
  initialState: {
    test: {
      count: 10,
    },
  },
}

export const mockCount = (count) => ({
  test: {
    count: count,
  },
});
