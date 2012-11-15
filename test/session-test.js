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
  it('should return an error when executing nonsense', function() {
    assert.deepEqual('             ^\nSyntax error: Expected ",", "=" or "from" but "s" found.', sess.exec('select three sheep from a field'));
  });
});

