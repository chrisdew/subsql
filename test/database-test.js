var assert = require("assert")

var database = require('../lib/database.js');
describe('Database', function() {
  it('should say "hello world"', function() {
    assert.equal("hello world", database.helloWorld());
  });
});

