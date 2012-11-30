var assert = require("assert")

var table = require('../lib/table.js');
describe('Table', function() {
  it('should say "hello table"', function() {
    assert.equal("hello table", table.hello());
  });
  it('should create an instance"', function() {
    assert.deepEqual({"rowsByPk":{},"pkName":null,"nextPk":1,"ai":false}, new table.Table());
  });
  it('should be an instance of event emitter', function() {
    assert.deepEqual("EventEmitter",
                     new table.Table().constructor.super_.name);
  });
  
  var bar;
  it('should insert a record', function(done) {
    bar = new table.Table({name:'bar',
                           fields:[{field:'id',type:'integer',pk:true,ai:true},
                                   {field:'foo',type: 'varchar'}]});
    bar.once('delta', function(delta) {
      assert.deepEqual({"op":"insert","table":"bar","row":{"_version":1,"id":1,"foo":"hello"}}, delta);
      done();
    });
    bar.insert({"table":"bar","fields":["id","foo"],"values":[1,"hello"]});
    console.log("bar", bar);
    assert.deepEqual({'1':{id:1,foo:'hello',_version:1}},
                     bar.rowsByPk);
    assert.deepEqual(2,
                     bar.nextPk);
  });
  
  it('should insert a second record', function(done) {
    bar.once('delta', function(delta) {
      assert.deepEqual({"op":"insert","table":"bar","row":{"_version":1,"id":2,"foo":"hello2"}}, delta);
      done();
    });
    bar.insert({"table":"bar","fields":["id","foo"],"values":[2,"hello2"]});
    assert.deepEqual({'1':{id:1,foo:'hello',_version:1},
                      "2":{"_version":1,"id":2,"foo":"hello2"}},
                     bar.rowsByPk);
    assert.deepEqual(3,
                     bar.nextPk);
  });
    
  it('should update a record', function(done) {
    bar.once('delta', function(delta) {
      assert.deepEqual({"op":"update","table":"bar","pk":"1","set":[{"field":"foo","expr":"hello"}]}, delta);
      done();
    });
    bar.update({"table":"bar","set":[{"field":"foo","expr":"hello"}],"where":{"expr":{"fn":"equal","args":[{field:"id"},1]}}});
  }); 

  it('should update a record again, with reversed where', function(done) {
    bar.once('delta', function(delta) {
      assert.deepEqual({"op":"update","table":"bar","pk":"1","set":[{"field":"foo","expr":"world"}]}, delta);
      done();
    });
    bar.update({"table":"bar","set":[{"field":"foo","expr":"world"}],"where":{"expr":{"fn":"equal","args":[1, {field:"id"}]}}});
  });
  
  it('can handle a nested where clause', function(done) {
    bar.once('delta', function(delta) {
      assert.deepEqual({"op":"update","table":"bar","pk":"1","set":[{"field":"foo","expr":"world"}]}, delta);
      done();
    });
    bar.update({"table":"bar","set":[{"field":"foo","expr":"world"}],"where":{"expr":{"fn":"equal","args":[1, {field:"id"}]}}});
  });
  
  it('can handle a deeply nested where clause', function(done) {
    bar.once('delta', function(delta) {
      assert.deepEqual({"op":"update","table":"bar","pk":"1","set":[{"field":"foo","expr":"world2"}]}, delta);
      done();
    });
    bar.update({"table":"bar","set":[{"field":"foo","expr":"world2"}],"where":{"expr":{"fn":"and","args":[{"fn":"equal","args":[{"field":"id"},1]},{"fn":"gt","args":[{"field":"id"},0]}]}}});
    console.log(JSON.stringify(bar));
  });
  
  it('should update a using a named function in the where clause', function(done) {
    bar.once('delta', function(delta) {
      assert.deepEqual({"op":"update","table":"bar","pk":"1","set":[{"field":"foo","expr":"hello2"}]}, delta);
      done();
    });
    bar.update({"table":"bar","set":[{"field":"foo","expr":"hello2"}],"where":{"expr":{"fn":"equalsOne","args":[{field:"id"}]}}});
  }); 

});

