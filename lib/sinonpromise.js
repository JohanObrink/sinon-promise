var Q = require('./q');

function addMethods(obj, deferred, autoFlush) {
  obj.resolve = function () {
    deferred.resolve.apply(obj, arguments);
    if(autoFlush) { Q.flush(); }
  };
  obj.reject = function () {
    deferred.reject.apply(obj, arguments);
    if(autoFlush) { Q.flush(); }
  };
  obj.notify = function () {
    deferred.notify.apply(obj, arguments);
    if(autoFlush) { Q.flush(); }
  };
}

function sinonPromise(sinon) {
  
  sinon.promise = function (autoFlush) {
    if(autoFlush !== false) {
      autoFlush = true;
    }
    
    var promise = sinon.spy(function () {

      promise._promises = promise._promises || [];

      var deferred = Q.defer();
      promise._promises.push(deferred);

      // add methods to call instances
      var _getCall = promise.getCall;
      promise.getCall = function (i) {
        var call = _getCall.call(promise, i);
        if(call) {
          addMethods(call, promise._promises[i], autoFlush);
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

      return deferred.promise;
    });
    return promise;
  };
}

sinonPromise.Q = Q;

module.exports = sinonPromise;