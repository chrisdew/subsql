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
  
  it('should insert a record', function() {
    var bar = new table.Table({name:'bar',
                               fields:[{field:'id',type:'integer',pk:true,ai:true},
                                       {field:'foo',type: 'varchar'}]});
    bar.insert({"table":"bar","fields":["id","foo"],"values":[1,"hello"]});
    //console.log("bar", bar);
    assert.deepEqual({name:'bar',
                      fields:[{field:'id',type:'integer',pk:true,ai:true},
                              {field:'foo',type:'varchar'}],
                      rowsByPk:{'1':{id:1,foo:'hello',_version:1}},
                      pkName:'id',
                      nextPk:2},
                     bar);
  });
});

