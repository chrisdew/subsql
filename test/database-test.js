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
  it('should create a table called mytable', function() {
    assert.deepEqual( { tablesByName: { mytable: { name: "mytable"
                                                 , fields: [ { field: "id", type: "integer", pk: true, ai: true }
                                                           , { field: "foo", type: "varchar"}
                                                           ]
                                                 , rowsByPk: {}
                                                 , pkName: null
                                                 , nextPk: 1
                      } } }
                    , new database.Database().createTable(
                      { name:"mytable"
                      , fields:[ { field: 'id', type: 'integer', pk:true, ai:true }
                               , { field: 'foo', type: 'varchar' }
                               ]
                      } ) );
  });
});

