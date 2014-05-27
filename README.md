sinon-promise
=============
[![Build Status](https://travis-ci.org/JohanObrink/sinon-promise.svg)](https://travis-ci.org/JohanObrink/sinon-promise)

Sinon with promises

*sinon-promise currently only supports Q and only works on the node platform*

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
