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

##Immediate invocation
A promise never resolves immediately. It always waits until the next event cycle.
In order to make synchronous testing easy, a sinonPromise always returns immediately.
If you don't want this behavior, pass in ```false``` to tell it not to flush:

```javascript
var promise = sinon.promise(false);
```

###Automatic invocation
If you want your promise to resolve or reject immediately when called, use ```resolves``` and ```rejects```
```javascript
var autoResolving = sinon.promise().resolves('foo');
var autoRejecting = sinon.promise().rejects('bar');
var spy = sinon.spy();
autoResolving().then(spy);
// spy is called with 'foo'
autoRejecting().catch(spy);
// spy is called with 'bar'
```

##sinonPromise.Q
The promise implementation in sinonPromise is a changed version of Q. To get your test modules
to use this version of promises (Why? See Immediate invocation!), you can use ```proxyquire```

**Module**
```javascript
var Q = require('q');
var deferred = Q.defer(); // you can pass the false flag here as well
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

License
-----------

###The MIT License (MIT)

*Copyright (c) 2014 Johan Öbrink*

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.