var Q = require('./q');

function resolves(obj) {
  return function () {
    obj._rejects = undefined;
    obj._resolves = arguments;
    return obj;
  };
}
function rejects(obj) {
  return function () {
    obj._resolves = undefined;
    obj._rejects = arguments;
    return obj;
  };
}

function addMethods(obj, deferred) {
  obj.resolve = function () {
    deferred.resolve.apply(obj, arguments);
  };
  obj.reject = function () {
    deferred.reject.apply(obj, arguments);
  };
  obj.notify = function () {
    deferred.notify.apply(obj, arguments);
  };
  obj.resolves = resolves(obj);
  obj.rejects = rejects(obj);
}

function sinonPromise(sinon) {
  
  sinon.promise = function (autoFlush) {
    if(autoFlush !== false) {
      autoFlush = true;
    }
    
    var promise = sinon.spy(function () {

      promise._promises = promise._promises || [];

      var deferred = Q.defer(autoFlush);
      promise._promises.push(deferred);

      // add methods to call instances
      var _getCall = promise.getCall;
      promise.getCall = function (i) {
        var call = _getCall.call(promise, i);
        if(call) {
          addMethods(call, promise._promises[i]);
        }
        return call;
      };

      // add methods to promise
      Object.keys(deferred).forEach(function (key) {
        promise[key] = function () {
          for(var i=0; i<promise.callCount; i++) {
            var call = promise.getCall(i);
            call[key].apply(call, arguments);
          }
        };
      });
      if(promise._resolves) { deferred.resolve.apply(deferred, promise._resolves); }
      if(promise._rejects) { deferred.reject.apply(deferred, promise._rejects); }

      return deferred.promise;
    });
    promise.resolves = resolves(promise);
    promise.rejects = rejects(promise);
    return promise;
  };
}

sinonPromise.Q = Q;

module.exports = sinonPromise;