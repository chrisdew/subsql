var assert = require("assert")

var database = require('../lib/database.js');
describe('Database', function() {
  it('should say "hello database"', function() {
    assert.equal("hello database", database.hello());
  });
  it('should create an instance"', function() {
    assert.deepEqual({tablesByName:{}}, new database.Database());
  });
  it('should be an instance of event emitter', function() {
    assert.deepEqual("EventEmitter",
                     new database.Database().constructor.super_.name);
  });
  
  var db = new database.Database();
  it('should create a table called mytable', function() {
    assert.deepEqual( { tablesByName: { mytable: { name: "mytable"
                                                 , fields: [ { field: "id", type: "integer", pk: true, ai: true }
                                                           , { field: "foo", type: "varchar"}
                                                           ]
                                                 , rowsByPk: {}
                                                 , pkName: 'id'
                                                 , nextPk: 1
                                                 , ai: true
                      } } }
                    , db.createTable(
                      { name:"mytable"
                      , fields:[ { field: 'id', type: 'integer', pk:true, ai:true }
                               , { field: 'foo', type: 'varchar' }
                               ]
                      } ) );
  });
  it('should add a new row to mytable', function(done) {
    assert.deepEqual( { tablesByName: { mytable: { name: "mytable"
                                                 , fields: [ { field: "id", type: "integer", pk: true, ai: true }
                                                           , { field: "foo", type: "varchar"}
                                                           ]
                                                 , rowsByPk: {1: { id: 1, foo: 'hello', _version: 1 } }
                                                 , pkName: 'id'
                                                 , nextPk: 2
                                                 , ai: true
                      } } }
                    , db.insert( {"table":"mytable","fields":["id","foo"],"values":[1,"hello"]}, done));
  });
  /*
  */
  
  it('should run a complex pushStar query', function(done) {
    var query = db.pushStar({"from":["mytable"],"where":{"expr":{"fn":"and","args":[{"fn":"gte","args":[{"field":"id"},1]},{"fn":"lt","args":[{"field":"id"},4]}]}}});
    var initialised = false;
    query.once('init', function(data) {
      console.log("initialised = true");
      initialised = true;
      assert.deepEqual([{"_version":1,"id":1,"foo":"hello"}], data);
      db.insert( {"table":"mytable","fields":["id","foo"],"values":[2,"world"]});
    });
    query.on('delta', function(delta) {
      console.log('delta received');
      console.log("initilised", initialised);
      assert(initialised);
      assert.deepEqual({"op":"insert","table":"mytable","row":{"_version":1,"id":2,"foo":"world"}}, delta);
      done();
    });
    //console.log('query', query.constructor, JSON.stringify(query));
    
  });
    
});

