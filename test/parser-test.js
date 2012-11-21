var assert = require("assert")

var peg = require('pegjs');
var fs = require('fs');
var parser = peg.buildParser(fs.readFileSync('lib/grammar.pegjs', 'utf8'));
describe('grammar', function() {
  it('select id, foo from bar', function() {
    assert.deepEqual({"select":{"exprs":["id","foo"],"from":["bar"]}}, parser.parse('select id, foo from bar'));
  });
  it('create table bar (id integer primary key auto_increment, foo varchar)', function() {
    assert.deepEqual({"createTable":{name:'bar',fields:[{"field":"id","type":"integer","pk":true,"ai":true},{"field":"foo","type":"varchar"}]}},
                     parser.parse('create table bar (id integer primary key auto_increment, foo varchar)'));
  });
  it('insert into bar (id, foo) values (1, "hello")', function() {
    assert.deepEqual({"insert":{"table":"bar","fields":["id","foo"],"values":[1,"hello"]}},
                     parser.parse('insert into bar (id, foo) values (1, "hello")'));
  });
  it('update bar set foo="hello" where id = 1', function() {
    assert.deepEqual({"update":{"table":"bar","set":[{"field":"foo","expr":"hello"}],"where":{"expr":{"fn":"equal","args":["id",1]}}}},
                     parser.parse('update bar set foo="hello" where id=1'));
  });
  it('select 423', function() {
    assert.deepEqual({"select":{"exprs":[423]}},
                     parser.parse('select 423'));
  });
  it('select 2 + 2', function() {
    assert.deepEqual({"select":{"exprs":[{"fn":"add","args":[2,2]}]}},
                     parser.parse('select 2 + 2'));
  });
  it('select 2 - 2', function() {
    assert.deepEqual({"select":{"exprs":[{"fn":"sub","args":[2,2]}]}},
                     parser.parse('select 2 - 2'));
  });
  it('select func()', function() {
    assert.deepEqual({"select":{"exprs":[{"fn":"func","args":[]}]}},
                     parser.parse('select func()'));
  });
  it('select func(2)', function() {
    assert.deepEqual({"select":{"exprs":[{"fn":"func","args":[2]}]}},
                     parser.parse('select func(2)'));
  });
  it('select func(func(2+2, 6), 10, foo)', function() {
    assert.deepEqual({"select":{"exprs":[{"fn":"func","args":[{"fn":"func","args":[{"fn":"add","args":[2,2]},6]},10,"foo"]}]}},
                     parser.parse('select func(func(2+2, 6), 10, foo)'));
  });
});