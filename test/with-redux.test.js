import withRedux from '../src/withRedux';
import { models, options } from './data';

const App = () => {};

describe('with Redux', () => {
  test('return withRedux App', () => {
    const reduxApp = withRedux(App, models, options);
    expect(typeof(reduxApp)).toEqual('function');
  })
})
