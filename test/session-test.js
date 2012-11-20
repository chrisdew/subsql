var assert = require("assert")

var session = require('../lib/session.js');
var database = require('../lib/database.js');


describe('Session', function() {
  var db = new database.Database();
  it('should say "hello session"', function() {
    assert.equal("hello session", session.hello());
  });
  it('should create an instance"', function() {
    assert.deepEqual("Session", new session.Session(db).constructor.name);
  });
  it('should be an instance of event emitter', function() {
    assert.deepEqual("EventEmitter",
                     new session.Session(db).constructor.super_.name);
  });
  it('should return an empty string when executing no input', function() {
    assert.deepEqual('', new session.Session(db).exec(''));
  });
  
  var sess = new session.Session(db);
  it('should event an error when executing nonsense', function(done) {
    sess.exec('select three sheep from a field', function(err, res) {
      assert.equal('             ^\nSyntax error: Expected ",", "=" or "from" but "s" found.',
                   err);
      done();
    });
  });
  
  var sess2 = new session.Session(db);
  it('should create a table', function(done) {
    sess2.exec('create table bar (id integer primary key, foo varchar)', function(err, res) {
      //console.log('on res', res);
      assert.equal('Table created.',
                   res);
      done();
    });
  });
  it('should insert a row', function(done) {
    sess2.exec('insert into bar (id, foo) values (1, "hello")', function(err, res) {
      assert.equal('1 row inserted.', res);
      done();
    });
  });
  
});

