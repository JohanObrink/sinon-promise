sinon-promise
=============
[![Build Status](https://travis-ci.org/JohanObrink/sinon-promise.svg?branch=master)](https://travis-ci.org/JohanObrink/sinon-promise)

Sinon with promises

*sinon-promise currently only supports Q and only works on the node platform*

##Install it
```shell
npm install sinon-promise
```

##Add it
```javascript
var sinon = require('sinon'),
  sinonPromise = require('sinon-promise');

sinonPromise(sinon);
```

##Use it
```javascript
var dbMock = {
  query: sinon.promise()
};

var success = sinon.spy();
var fail = sinon.spy();

dbMock.query('stuffs').then(success).catch(fail);

dbMock.query.resolve({ data: 'herp '});

sinon.assert.calledOnce(success);
sinon.assert.calledWith(success, { data: 'herp' });
sinon.assert.notCalled(fail);
```

##Asynchronous invocation
A promise never resolves immediately. It always waits until the next event cycle.
In order to make synchronous testing easy, a sinonPromise always returns immediately.
If you don't want this behavior, pass in ```false``` to tell it not to flush:

```javascript
var promise = sinon.promise(false);
```

##sinonPromise.Q
The promise implementation in sinonPromise is a changed version of Q. To get your test modules
to use this version of promises (Why? See Asynchronous invocation!), you can use ```proxyquire```

**Module**
```javascript
var Q = require('q');
// do stuff
```

**Test**
```javascript
var proxyquire = request('proxyquire'),
  sinon = require('sinon'),
  sinonPromise = require('sinonPromise');

sinonPromise(sinon);

var testModule = proxyquire('./myModule', {
  'q': sinonPromise.Q
});
```

###Call by numbers
```javascript
var dbMock = {
  query: sinon.promise()
};

var success1 = sinon.spy();
var fail1 = sinon.spy();

dbMock.query('stuffs').then(success1).catch(fail1);
dbMock.query('others').then(success2).catch(fail2);

dbMock.query.firstCall.resolve({ data: 'herp '});
dbMock.query.secondCall.reject('Error');

sinon.assert.calledWith(success1, { data: 'herp' });
sinon.assert.notCalled(fail1);

sinon.assert.notCalled(success2);
sinon.assert.calledWith(fail2, 'Error');
```

###Call by arguments
Not implemented yet
