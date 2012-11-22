var assert = require("assert")

var row = require('../lib/row.js');
describe('Row', function() {
  it('should say "hello row"', function() {
    assert.equal("hello row", row.hello());
  });
  it('should create an instance"', function() {
    assert.deepEqual({"_version": 1}, new row.Row());
  });
  it('should be an instance of event emitter', function() {
    assert.deepEqual("EventEmitter",
                     new row.Row().constructor.super_.name);
  });
  var r = new row.Row(['id','foo'],[1,"hello"]);
  it('should be a row with some fields', function() {
    assert.deepEqual({"_version":1,"id":1,"foo":"hello"},r);
  });
  it('should update the value of foo to "world"', function() {
    r.update([{"field":"foo","expr":"world"}]);
    assert.deepEqual({"_version":2,"id":1,"foo":"world"},r);
  });

});

