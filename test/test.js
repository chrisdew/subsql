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
  it('select id, foo from bar', function() {
    assert.deepEqual({"select":{"exprs":["id","foo"],"from":["bar"]}}, parser.parse('select id, foo from bar'));
  });
  it('create table bar (id integer primary key auto_increment, foo varchar)', function() {
    assert.deepEqual({"createTable":[{"field":"id","type":"integer","pk":true,"ai":true},{"field":"foo","type":"varchar"}]},
                     parser.parse('create table bar (id integer primary key auto_increment, foo varchar)'));
  });
  it('insert into bar (id, foo) values (1, "hello")', function() {
    assert.deepEqual({"insert":{"table":"bar","fields":["id","foo"],"values":[1,"hello"]}},
                     parser.parse('insert into bar (id, foo) values (1, "hello")'));
  });
  it('update bar set foo="hello" where id = 1', function() {
    assert.deepEqual({"insert":{"fields":["id","foo"],"values":[1,"hello"]}},
                     parser.parse('update bar set foo="hello" where id=1'));
  });
});