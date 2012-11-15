var assert = require("assert")

var subsql = require('../index.js');
describe('SubSQL', function() {
  it('should say "hello world"', function() {
    assert.equal("hello world", subsql.helloWorld());
  });
});

