var assert = require("assert")

var peg = require('pegjs');
var fs = require('fs');
var parser = peg.buildParser(fs.readFileSync('lib/grammar.pegjs', 'utf8'));
describe('grammar', function() {
  it('select id, foo from bar', function() {
    assert.deepEqual({"select":{"exprs":[{field:"id"},{field:"foo"}],"from":["bar"]}}, parser.parse('select id, foo from bar'));
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
    assert.deepEqual({"update":{"table":"bar","set":[{"field":"foo","expr":"hello"}],"where":{"expr":{"fn":"equal","args":[{field:"id"},1]}}}},
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
  it('select * from bar', function() {
    assert.deepEqual({"selectStar":{from:["bar"]}},
                     parser.parse('select * from bar'));
  });
/*

This test takes 25s to run!  All the others take 149ms in total.

  it('select func(func(2+2, 6), 10, foo)', function() {
    assert.deepEqual({"select":{"exprs":[{"fn":"func","args":[{"fn":"func","args":[{"fn":"add","args":[2,2]},6]},10,{field:"foo"}]}]}},
                     parser.parse('select func(func(2+2, 6), 10, foo)'));
  });
*/ 
  it('select * from bar', function() {
    assert.deepEqual({"selectStar":{"from":["bar"]}},
                     parser.parse('select * from bar'));
  });
  it('push * from bar', function() {
    assert.deepEqual({"pushStar":{"from":["bar"]}},
                     parser.parse('push * from bar'));
  });
  it('select * from bar where x = 1 and y < now()', function() {
    assert.deepEqual({"selectStar":{"from":["bar"],"where":{"expr":{"fn":"and","args":[{"fn":"equal","args":[{"field":"x"},1]},{"fn":"lt","args":[{"field":"y"},{"fn":"now","args":[]}]}]}}}},
                     parser.parse('select * from bar where x = 1 and y < now()'));
  });
  it('select * from bar where x = 1 and x > 0', function() {
    assert.deepEqual({"selectStar":{"from":["bar"],"where":{"expr":{"fn":"and","args":[{"fn":"equal","args":[{"field":"x"},1]},{"fn":"gt","args":[{"field":"x"},0]}]}}}},
                     parser.parse('select * from bar where x = 1 and x > 0'));
  });
});
