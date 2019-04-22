"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const deferPromise = () => {
  let tmpResolve;
  let tmpReject;
  const promise = new Promise((resolve, reject) => {
    tmpResolve = resolve;
    tmpReject = reject;
  });
  promise.resolve = tmpResolve;
  promise.reject = tmpReject;
  return promise;
};

const middleware = store => next => action => {
  next(action);
  action.promise = deferPromise();
  return action.promise;
};

var _default = middleware;
exports.default = _default;