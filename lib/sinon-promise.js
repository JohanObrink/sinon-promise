var Q = require('q');

function addMethods(obj, deferred) {
  Object.keys(deferred)
    .filter(function (key) {
      return 'function' === typeof deferred[key];
    })
    .forEach(function (key) {
      obj[key] = deferred[key];
    });
}

function sinonq(sinon) {
  sinon.stub(process, 'nextTick').yields();
  
  sinon.promise = function () {
    var sinonPromise = sinon.spy(function () {

      sinonPromise._promises = sinonPromise._promises || [];

      var deferred = Q.defer();
      sinonPromise._promises.push(deferred);

      // add methods to call instances
      var _getCall = sinonPromise.getCall;
      sinonPromise.getCall = function (i) {
        var call = _getCall.call(sinonPromise, i);
        if(call) {
          addMethods(call, sinonPromise._promises[i]);
        }
        return call;
      };

      // add methods to promise
      Object.keys(deferred).forEach(function (key) {
        sinonPromise[key] = function () {
          for(var i=0; i<sinonPromise.callCount; i++) {
            var call = sinonPromise.getCall(i);
            call[key].apply(call, arguments);
          }
        };
      });

      return deferred.promise;
    });
    return sinonPromise;
  };
}

sinonq.restore = function () {
  if(process && process.nextTick && 'function' === typeof process.nextTick.restore) {
    process.nextTick.restore();
  }
};

module.exports = sinonq;