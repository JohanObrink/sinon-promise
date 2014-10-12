/* jshint expr: true */
var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  sinonPromise = require('../lib/sinonpromise'),
  Q = sinonPromise.Q;

describe('q', function () {

  var success, fail;
  beforeEach(function () {
    success = sinon.spy();
    fail = sinon.spy();
    //sinon.stub(process, 'nextTick').yields();
  });

  describe('defer', function () {
    it('resolves immediately', function () {
      var deferred = Q.defer();
      deferred.promise.then(success).catch(fail);
      deferred.resolve('foo');
      
      expect(fail).not.called;
      expect(success).calledOnce.calledWith('foo');
    });
    it('rejects immediately', function () {
      var deferred = Q.defer();
      deferred.promise.then(success).catch(fail);
      deferred.reject('foo');
      
      expect(fail).calledOnce.calledWith('foo');
      expect(success).not.called;
    });
  });

  describe('nfcall', function () {
    it('resolves immediately', function () {
      var nodeCallback = sinon.stub();
      Q.nfcall(nodeCallback).then(success).catch(fail);
      nodeCallback.yield(null, 'foo');
      
      expect(fail).not.called;
      expect(success).calledOnce.calledWith('foo');
    });
    it('rejects immediately', function () {
      var nodeCallback = sinon.stub();
      Q.nfcall(nodeCallback).then(success).catch(fail);
      nodeCallback.yield('foo');
      
      expect(fail).calledOnce.calledWith('foo');
      expect(success).not.called;
    });
  });
});