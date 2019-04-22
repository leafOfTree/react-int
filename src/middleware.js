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

const middleware = store => next => action => {
  next(action);

  action.promise = deferPromise();
  return action.promise;
}

export default middleware;
