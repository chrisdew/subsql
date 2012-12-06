var assert = require("assert")

var query = require('../lib/query.js');
describe('Query', function() {
  it('should say "hello query"', function() {
    assert.equal("hello query", query.hello());
  });
});

