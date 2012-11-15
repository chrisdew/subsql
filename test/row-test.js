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
});

