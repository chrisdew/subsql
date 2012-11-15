var assert = require("assert")

var peg = require('pegjs');
var fs = require('fs');
var parser = peg.buildParser(fs.readFileSync('grammar.pegjs', 'utf8'));
describe('grammar', function() {
  it('select id, foo from bar', function() {
    assert.deepEqual({"select":{"exprs":["id","foo"],"from":["bar"]}}, parser.parse('select id, foo from bar'));
  });
  it('create table bar (id integer primary key auto_increment, foo varchar)', function() {
    assert.deepEqual({"createTable":{fields:[{"field":"id","type":"integer","pk":true,"ai":true},{"field":"foo","type":"varchar"}]}},
                     parser.parse('create table bar (id integer primary key auto_increment, foo varchar)'));
  });
  it('insert into bar (id, foo) values (1, "hello")', function() {
    assert.deepEqual({"insert":{"table":"bar","fields":["id","foo"],"values":[1,"hello"]}},
                     parser.parse('insert into bar (id, foo) values (1, "hello")'));
  });
  it('update bar set foo="hello" where id = 1', function() {
    assert.deepEqual({"update":{"table":"bar","set":[{"field":"foo","expr":"hello"}],"where":{"expr":{"op":"=","field":"id","value":1}}}},
                     parser.parse('update bar set foo="hello" where id=1'));
  });
});