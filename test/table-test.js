var assert = require("assert")

var table = require('../lib/table.js');
describe('Table', function() {
  it('should say "hello table"', function() {
    assert.equal("hello table", table.hello());
  });
  it('should create an instance"', function() {
    assert.deepEqual({"rowsByPk":{},"pkName":null,"nextPk":1}, new table.Table());
  });
  it('should be an instance of event emitter', function() {
    assert.deepEqual("EventEmitter",
                     new table.Table().constructor.super_.name);
  });
});

