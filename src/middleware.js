const deferPromise = () => {
  let tmpResolve;
  let tmpReject;
  const promise = new Promise((resolve, reject) => {
    tmpResolve = resolve;
    tmpReject = reject;
  })
  promise.resolve = tmpResolve;
  promise.reject = tmpReject;
  return promise;
}

// eslint-disable-next-line no-unused-vars
const middleware = store => next => action => {
  next(action);

  action.promise = deferPromise();
  return action.promise;
}

export default middleware;
