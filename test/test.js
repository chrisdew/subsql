var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})

var subsql = require('../index.js');
describe('SubSQL', function() {
  it('should say "hello world"', function() {
    assert.equal("hello world", subsql.helloWorld());
  });
});

var peg = require('pegjs');
var fs = require('fs');
var parser = peg.buildParser(fs.readFileSync('grammar.pegjs', 'utf8'));
describe('grammar', function() {
  it('asdas', function() {
    assert.deepEqual({"select":{"exprs":["id","foo"],"from":["bar"]}}, parser.parse('select id, foo from bar'));
  });
});