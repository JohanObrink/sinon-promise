/* jshint expr: true */
var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  sinonPromise = require('../'),
  Q = sinonPromise.Q;

chai.use(require('sinon-chai'));

describe('sinon-promise', function () {
  var foo;
  beforeEach(function () {
    sinonPromise(sinon);
    foo = { dostuff: sinon.promise() };
  });
  afterEach(function () {
    delete sinon.promise;
  });
  it('adds a promise method to sinon', function () {
    expect(sinon.promise).to.be.a('function');
    sinon.promise()();
  });
  it('returns a promise', function () {
    var promise = foo.dostuff();
    expect(promise).to.be.an('object');
    expect(promise.then).to.be.a('function');
    expect(promise.catch).to.be.a('function');
    expect(promise.finally).to.be.a('function');
  });
  it('resolves promises', function () {
    var success = sinon.spy();
    var fail = sinon.spy();
    foo.dostuff().then(success).catch(fail);

    expect(success, 'success').not.called;
    expect(fail, 'fail').not.called;

    foo.dostuff.resolve('herp');

    expect(success, 'success').calledOnce;
    expect(success, 'success').calledWith('herp');
    expect(fail, 'fail').not.called;
  });
  it('resolves promises without auto flush', function () {
    var success = sinon.spy();
    var fail = sinon.spy();
    foo.dostuff = sinon.promise(false);
    foo.dostuff().then(success).catch(fail);

    expect(success, 'success').not.called;
    expect(fail, 'fail').not.called;

    foo.dostuff.resolve('herp');

    expect(success, 'success').not.called;
    expect(fail, 'fail').not.called;

    Q.flush();

    expect(success, 'success').calledOnce;
    expect(success, 'success').calledWith('herp');
    expect(fail, 'fail').not.called;
  });
  it('eventually resolves promises without auto flush', function (done) {
    var success = sinon.spy();
    var fail = sinon.spy();
    foo.dostuff = sinon.promise(false);
    foo.dostuff().then(success).catch(fail);

    expect(success, 'success').not.called;
    expect(fail, 'fail').not.called;

    foo.dostuff.resolve('herp');

    expect(success, 'success').not.called;
    expect(fail, 'fail').not.called;

    setTimeout(function () {
      expect(success, 'success').calledOnce;
      expect(success, 'success').calledWith('herp');
      expect(fail, 'fail').not.called;

      done();
    }, 10);
  });
  it('rejects promises', function () {
    var success = sinon.spy();
    var fail = sinon.spy();
    foo.dostuff().then(success).catch(fail);

    expect(success, 'success').not.called;
    expect(fail, 'fail').not.called;

    foo.dostuff.reject('herp');
    expect(success, 'success').not.called;
    expect(fail, 'fail').calledOnce;
    expect(fail, 'fail').calledWith('herp');
  });
  it('rejects promises without auto flush', function () {
    var success = sinon.spy();
    var fail = sinon.spy();
    foo.dostuff = sinon.promise(false);
    foo.dostuff().then(success).catch(fail);

    expect(success, 'success').not.called;
    expect(fail, 'fail').not.called;

    foo.dostuff.reject('herp');

    expect(success, 'success').not.called;
    expect(fail, 'fail').not.called;

    Q.flush();

    expect(success, 'success').not.called;
    expect(fail, 'fail').calledOnce;
    expect(fail, 'fail').calledWith('herp');
  });
  it('can separate between promises based on calls', function () {
    var listener1 = sinon.spy();
    var listener2 = sinon.spy();
    foo.dostuff().then(listener1);
    foo.dostuff().then(listener2);

    expect(listener1, 'listener1').not.called;
    expect(listener2, 'listener2').not.called;

    foo.dostuff.firstCall.resolve('herp');
    expect(listener1, 'listener1').calledOnce;
    expect(listener1, 'listener1').calledWith('herp');
    expect(listener2, 'listener2').not.called;

    foo.dostuff.secondCall.resolve('derp');
    expect(listener1, 'listener1').calledOnce;
    expect(listener1, 'listener1').calledWith('herp');
    expect(listener2, 'listener2').calledOnce;
    expect(listener2, 'listener2').calledWith('derp');
  });
  xit('can separate between promises based on args', function () {
    var listener1 = sinon.spy();
    var listener2 = sinon.spy();
    foo.dostuff('foo').then(listener1);
    foo.dostuff('bar').then(listener2);

    expect(listener1, 'listener1').not.called;
    expect(listener2, 'listener2').not.called;

    foo.dostuff.withArgs('foo').resolve('herp');
    expect(listener1, 'listener1').calledOnce;
    expect(listener1, 'listener1').calledWith('herp');
    expect(listener2, 'listener2').not.called;

    foo.dostuff.withArgs('bar').resolve('derp');
    expect(listener1, 'listener1').calledOnce;
    expect(listener1, 'listener1').calledWith('herp');
    expect(listener2, 'listener2').calledOnce;
    expect(listener2, 'listener2').calledWith('derp');
  });
});