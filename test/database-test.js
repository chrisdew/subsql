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
                      } } }
                    , db.insert( {"table":"mytable","fields":["id","foo"],"values":[1,"hello"]}, done));
  });
  /*
  */
});

